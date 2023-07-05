CREATE DATABASE IF NOT EXISTS organization_structure;
CREATE DATABASE IF NOT EXISTS organization_structure_test;
CREATE USER org_user WITH PASSWORD 'user_pwd123';
GRANT ALL PRIVILEGES ON DATABASE organization_structure_test to org_user;
GRANT ALL PRIVILEGES ON DATABASE organization_structure to org_user;
ALTER DATABASE organization_structure OWNER TO org_user;
ALTER DATABASE organization_structure_test OWNER TO org_user;