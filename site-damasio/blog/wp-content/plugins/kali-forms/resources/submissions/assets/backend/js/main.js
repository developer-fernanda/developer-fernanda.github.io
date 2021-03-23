jQuery(document).ready(() => {
    jQuery('.kaliforms-submission-link').on('click', e => {
        e.preventDefault();
        kaliFormsCopyToClipboard(jQuery(e.target).parent().data('link'));
        alert('Link to submission copied to clipboard');
    });

    jQuery('.kaliforms-resend-emails').on('click', e => {
        e.preventDefault();
        let args = {
            submissionId: jQuery(e.target).parent().data('submission-id'),
            formId: jQuery(e.target).parent().data('form-id'),
            nonce: KaliFormsObject.ajax_nonce,
        }

        jQuery.ajax({
            type: 'POST',
            data: { action: 'kaliforms_resend_emails', args },
            dataType: 'json',
            url: ajaxurl,
            complete: (data) => {
                if (data.responseText === 'ok') {
                    alert('Emails resent')
                } else {
                    alert('Something went wrong')
                }
            }
        });
    })

    jQuery('#kaliforms_export_from').on('change', e => {
        let newForm = e.target.value;
        let args = {
            formId: newForm,
            nonce: KaliFormsObject.ajax_nonce,
        }

        jQuery.ajax({
            type: 'POST',
            data: { action: 'kaliforms_retrieve_form_fields', args },
            dataType: 'json',
            url: ajaxurl,
            success: data => {
                let container = jQuery('#kaliforms-form-fields');
                container.empty();

                if (data === 'Something went wrong.') {
                    return
                }
                if (typeof data.map !== 'function') {
                    return;
                }

                data.map(e => {
                    let html = '<label style="margin-right:10px">' +
                        '<input type="checkbox" id="kaliforms_export_field_' + e.id + '" name="kaliforms_export_fields" value="' + e.id + '" />' + e.caption + '</label>';
                    container.append(html)
                });
            }
        });
    });
})

const kaliFormsCopyToClipboard = str => {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0        // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)     // Store selection if found
            : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
        document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
        document.getSelection().addRange(selected);   // Restore the original selection
    }
};
