# Use the official Metabase image as the base
FROM metabase/metabase:latest

# Set environment variables for PostgreSQL connection
ENV MB_DB_TYPE=postgres \
    MB_DB_HOST=db \
    MB_DB_PORT=5432 \
    MB_DB_DATABASE=pymesdb \
    MB_DB_USER=postgres \
    MB_DB_PASSWORD=pr-final

# Expose the default Metabase port
EXPOSE 3000

# Start Metabase when the container runs
CMD ["java", "-jar", "/app/metabase.jar"]
