FROM php:8.4-fpm-alpine

# 1. Permanent Dependencies
RUN apk add --no-cache \
    git curl bash zip unzip mysql-client supervisor nodejs npm \
    libpng libjpeg-turbo freetype icu-libs libzip libxml2

# 2. Build-only Dependencies (cleaned up after install)
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS oniguruma-dev libzip-dev libpng-dev \
    libjpeg-turbo-dev freetype-dev libxml2-dev icu-dev linux-headers \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql mbstring zip bcmath gd exif pcntl xml intl sockets \
    && pecl install redis && docker-php-ext-enable redis \
    && apk del .build-deps

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

ARG UID=1000
ARG GID=1000
ARG USERNAME=dev

# Create user and set up permissions in ONE layer
RUN addgroup -g ${GID} ${USERNAME} \
    && adduser -D -G ${USERNAME} -u ${UID} ${USERNAME} \
    && mkdir -p storage bootstrap/cache node_modules \
    && chown -R ${USERNAME}:${USERNAME} /var/www/html \
    && chmod -R 775 storage bootstrap/cache
# Configure PHP-FPM to listen on port 9001
RUN echo "listen = 0.0.0.0:9001" > /usr/local/etc/php-fpm.d/zz-docker.conf

# Note: We don't switch to USER dev here because Supervisor needs root to start
EXPOSE 9001
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
