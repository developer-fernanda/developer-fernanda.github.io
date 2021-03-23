<?php
/**
 * As configurações básicas do WordPress
 *
 * O script de criação wp-config.php usa esse arquivo durante a instalação.
 * Você não precisa usar o site, você pode copiar este arquivo
 * para "wp-config.php" e preencher os valores.
 *
 * Este arquivo contém as seguintes configurações:
 *
 * * Configurações do MySQL
 * * Chaves secretas
 * * Prefixo do banco de dados
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Configurações do MySQL - Você pode pegar estas informações com o serviço de hospedagem ** //
/** O nome do banco de dados do WordPress */
define( 'DB_NAME', 'wordpress' );

/** Usuário do banco de dados MySQL */
define( 'DB_USER', 'root' );

/** Senha do banco de dados MySQL */
define( 'DB_PASSWORD', '' );

/** Nome do host do MySQL */
define( 'DB_HOST', 'localhost' );

/** Charset do banco de dados a ser usado na criação das tabelas. */
define( 'DB_CHARSET', 'utf8mb4' );

/** O tipo de Collate do banco de dados. Não altere isso se tiver dúvidas. */
define( 'DB_COLLATE', '' );

/**#@+
 * Chaves únicas de autenticação e salts.
 *
 * Altere cada chave para um frase única!
 * Você pode gerá-las
 * usando o {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org
 * secret-key service}
 * Você pode alterá-las a qualquer momento para invalidar quaisquer
 * cookies existentes. Isto irá forçar todos os
 * usuários a fazerem login novamente.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '5M@pL~?D#cT{/8?wAM]my)f/<{d]_aZ_*y|f~,|48$]697DbEFj=#@R$o164VBvs' );
define( 'SECURE_AUTH_KEY',  '%@ZI]K,Zg8tr0sIi![yeyIj~<+%TxCnfK-<f7G@A)g<{z9mqeHw|~/2Iqa7U96<_' );
define( 'LOGGED_IN_KEY',    'aDd=w9dgmJ?7[WA1s_gh8 K:s; }e|$ehL]~kRShdesn1:iw t(`^B](opbTM1<]' );
define( 'NONCE_KEY',        '3`6ZUM8B#[[-{z4$UO;NL_{B{cL:74*pZ[7m/$,>QU->5@JAY%#Pc)9Vb,_r2 v[' );
define( 'AUTH_SALT',        ']M={|w&~_ @.!VC.Q~LSxDbi}Nqtv!8x({V#qoo506<}Odqp;8QkNa8g)&fvjS$h' );
define( 'SECURE_AUTH_SALT', '4sFcUuq??|3ZC-c9)r2t)i7+j#(/qnpVo=gD4jqNo~ur=6L$T>TNkBy.:lv=wd|F' );
define( 'LOGGED_IN_SALT',   'vqVy{(lse!gNbH|w_*BYn*jjH;}H^rs20JW)_~!3{bv4!c6ah}?m9y<9vx:m:6_H' );
define( 'NONCE_SALT',       'D0tfjK]0>Q4=Z,4x~ hZ2|vm7#N2u u_X%Gj!+#tPDd`S_3XAV4}:;aI d*5;6c8' );

/**#@-*/

/**
 * Prefixo da tabela do banco de dados do WordPress.
 *
 * Você pode ter várias instalações em um único banco de dados se você der
 * um prefixo único para cada um. Somente números, letras e sublinhados!
 */
$table_prefix = 'wp_';

/**
 * Para desenvolvedores: Modo de debug do WordPress.
 *
 * Altere isto para true para ativar a exibição de avisos
 * durante o desenvolvimento. É altamente recomendável que os
 * desenvolvedores de plugins e temas usem o WP_DEBUG
 * em seus ambientes de desenvolvimento.
 *
 * Para informações sobre outras constantes que podem ser utilizadas
 * para depuração, visite o Codex.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Isto é tudo, pode parar de editar! :) */

/** Caminho absoluto para o diretório WordPress. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Configura as variáveis e arquivos do WordPress. */
require_once ABSPATH . 'wp-settings.php';
