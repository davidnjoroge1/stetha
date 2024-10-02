#### for cases of database this are the commands used.

#sudo -u postgres psql
#-- Connect to your database conversa_dj:
#\c conversa_dj
#
#-- Grant necessary privileges to your user (davy):
#GRANT CONNECT ON DATABASE conversa_dj TO davy;
#GRANT USAGE ON SCHEMA public TO davy;
#GRANT CREATE ON SCHEMA public TO davy;
#GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO davy;
#

#then migrate