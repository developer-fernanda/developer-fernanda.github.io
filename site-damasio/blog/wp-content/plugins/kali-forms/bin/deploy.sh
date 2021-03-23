#!/usr/bin/env bash

# Note that this does not use pipefail
# because if the grep later doesn't match any deleted files,
# which is likely the majority case,
# it does not exit with a 0, and I only care about the final exit.
set -eo

# Common cleanup actions.
function cleanup() {
	echo "ℹ︎ Cleaning up..."

	rm -rf "$SVN_DIR"
	rm -rf "$TMP_DIR"
}

# Provide a basic version identifier, particularly since this script
# is usually accessed via CDN.
echo "ℹ︎ WP-ORG-PLUGIN-DEPLOY VERSION: 2019051201"

if [[ -z "$CI" ]]; then
	echo "𝘅︎ Script is only to be run by GitLab CI" 1>&2
	exit 1
fi

# Ensure certain environment variables are set
# IMPORTANT: while access to secrets is restricted in the GitLab UI,
# they are by necessity provided as plaintext in the context of this script,
# so do not echo or use debug mode unless you want your secrets exposed!
if [[ -z "$WP_ORG_USERNAME" ]]; then
	echo "𝘅︎ WordPress.org username not set" 1>&2
	exit 1
fi

if [[ -z "$WP_ORG_PASSWORD" ]]; then
	echo "𝘅︎ WordPress.org password not set" 1>&2
	exit 1
fi

if [[ -z "$PLUGIN_SLUG" ]]; then
	echo "𝘅︎ Plugin's SVN slug is not set" 1>&2
	exit 1
fi

if [[ -z "$PLUGIN_VERSION" ]]; then
	echo "𝘅︎ Plugin's version is not set" 1>&2
	exit 1
fi

if [[ -z "$WP_ORG_ASSETS_DIR" ]]; then
	WP_ORG_ASSETS_DIR=".wordpress-org"
fi

# Create empty static-assets directory if needed, triggering
# removal of any stray assets in svn.
if [[ ! -d "${CI_PROJECT_DIR}/${WP_ORG_ASSETS_DIR}/" ]]; then
	mkdir -p "${CI_PROJECT_DIR}/${WP_ORG_ASSETS_DIR}/"
fi

echo "ℹ︎ PLUGIN_SLUG: ${PLUGIN_SLUG}"
echo "ℹ︎ PLUGIN_VERSION: ${PLUGIN_VERSION}"
echo "ℹ︎ WP_ORG_RELEASE_REF: ${WP_ORG_RELEASE_REF}"
echo "ℹ︎ WP_ORG_ASSETS_DIR: ${WP_ORG_ASSETS_DIR}"

TIMESTAMP=$(date +"%s")
SVN_URL="https://plugins.svn.wordpress.org/${PLUGIN_SLUG}/"
SVN_DIR="${CI_BUILDS_DIR}/svn/${PLUGIN_SLUG}-${TIMESTAMP}"
SVN_TAG_DIR="${SVN_DIR}/tags/${PLUGIN_VERSION}"
TMP_DIR="${CI_BUILDS_DIR}/git-archive/${PLUGIN_SLUG}-${TIMESTAMP}"

# Limit checkouts for efficiency
echo "➤ Checking out dotorg repository..."
svn checkout --depth immediates "$SVN_URL" "$SVN_DIR"
cd "$SVN_DIR"
svn update --set-depth infinity assets
svn update --set-depth infinity trunk
svn update --set-depth infinity "$SVN_TAG_DIR"

# Ensure we are in the $CI_PROJECT_DIR directory, just in case
echo "➤ Copying files..."
cd "$CI_PROJECT_DIR"

git config --global user.email "cristea.cosmin87@gmail.com"
git config --global user.name "Cristea Cosmin"

# If there's no .gitattributes file, write a default one into place
if [[ ! -e "${CI_PROJECT_DIR}/.gitattributes" ]]; then
	cat > "${CI_PROJECT_DIR}/.gitattributes" <<-EOL
	/${WP_ORG_ASSETS_DIR} export-ignore
	/.gitattributes export-ignore
	/.gitignore export-ignore
	/.gitlab-ci.yml export-ignore
	EOL

	# The .gitattributes file has to be committed to be used
	# Just don't push it to the origin repo :)
	git add .gitattributes && git commit -m "Add .gitattributes file"
fi

# This will exclude everything in the .gitattributes file with the export-ignore flag
mkdir -p "$TMP_DIR"
git archive HEAD | tar x --directory="$TMP_DIR"

cd "$SVN_DIR"

# Copy from clean copy to /trunk
# The --delete flag will delete anything in destination that no longer exists in source
rsync -r "$TMP_DIR/" trunk/ --delete

# Copy dotorg assets to /assets
rsync -r "${CI_PROJECT_DIR}/${WP_ORG_ASSETS_DIR}/" assets/ --delete

# Add everything and commit to SVN
# The force flag ensures we recurse into subdirectories even if they are already added
# Suppress stdout in favor of svn status later for readability
echo "➤ Preparing files..."
svn add . --force > /dev/null

# SVN delete all deleted files
# Also suppress stdout here
svn status | grep '^\!' | sed 's/! *//' | xargs -I% svn rm % > /dev/null

# If tag already exists, remove and update from trunk.
# Generally, this applies when bumping WP version compatibility.
# svn doesn't have a proper rename function, prompting the remove/copy dance.
if [[ -d "$SVN_TAG_DIR" ]]; then
	echo "➤ Removing existing tag before update..."
	svn rm "$SVN_TAG_DIR"
fi

# Copy new/updated tag to maintain svn history.
if [[ ! -d "$SVN_TAG_DIR" ]]; then
	echo "➤ Copying tag..."
	svn cp "trunk" "$SVN_TAG_DIR"
fi

svn status

# Stop here unless this is a merge into master.
# if [[ -z "$CI_COMMIT_REF_NAME" || -z "$WP_ORG_RELEASE_REF" || "$CI_COMMIT_REF_NAME" != "$WP_ORG_RELEASE_REF" ]]; then
# 	echo "𝘅︎ EXITING before commit step as this is the '${CI_COMMIT_REF_NAME}' ref, not the '${WP_ORG_RELEASE_REF}' ref." 1>&2

# 	cleanup
# 	exit 0
# fi

echo "➤ Committing files..."
svn commit -m "Update to version ${PLUGIN_VERSION} from GitLab (${CI_PROJECT_URL}; ${CI_JOB_URL})" --no-auth-cache --non-interactive  --username "$WP_ORG_USERNAME" --password "$WP_ORG_PASSWORD"

cleanup

echo "✓ Plugin deployed!"
