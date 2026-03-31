FROM php:8.2-apache
# Install the mysqli extension
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli