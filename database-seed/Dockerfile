FROM mongo

COPY ./ecommerce ./ecommerce
CMD mongorestore --host mongo --port 27017 --db ecommerce ./ecommerce