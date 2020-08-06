<?php
/**
 * Template Name: Home
 * 
 * @package gerandofalcoes
 */

  get_header();
?>

	<main id="primary" class="site-main">
		<?php if( get_field('header') ): ?>
			<h2><?php the_field('header'); ?></h2>
		<?php endif; ?>
	</main><!-- #main -->

<?php

get_footer();
