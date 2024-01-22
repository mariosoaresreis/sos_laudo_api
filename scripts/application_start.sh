
 #!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/soslaudos-api
sudo chown -R ec2-user:ec2-user /home/ec2-user/soslaudos-api/

#navigate into our working directory where we have all our github files
cd /home/ec2-user/soslaudos-api

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install

# stop pm2
pm2 stop server-api

node --max-old-space-size=16384

#build project
node ace build --production

cd build

touch .env
echo 'PORT=3333
APP_KEY=PAclErZZDX6mMVavFe_EVmlerPi-pMil
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
DRIVE_DISK=local
DB_CONNECTION=pg
PG_HOST=db-sos-laudos.cf5a2r4aizl8.us-east-1.rds.amazonaws.com
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=CedimVet2023Cedim2024
PG_DB_NAME=postgres
SAND_BOX_URL=https://sandbox.api.pagseguro.com/charges
SAND_BOX_BOLETO_URL=https://sandbox.api.pagseguro.com/orders
SAND_BOX_QR_URL=https://sandbox.api.pagseguro.com/orders
SAND_BOX_VALIDATE_PAYMENT=https://sandbox.api.pagseguro.com/charges/
TKN_SANDBOX=CA5D5A232D2F475987169575173DE454
REACT_APP_CRYPT_KEY=DSAKDKNASDUD78GQFBG243483-19321IMPNEHB178251523FZ12UZYBQW786RU290-ROXPJFNFDNFX2GBSBF
ORTHANC_SOS_LAUDOS=http://18.229.77.213:8042
ORTHANC_SOS_LAUDOS_TKN=Y2VkaW06Y2VkaW0=
AWS_BUCKET_NAME=media.cedimvet.flowify.com.br
AWS_ACCESS_KEY_ID=AKIAI56YIFS45PC5XEWA
AWS_SECRET_ACCESS_KEY=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
AWS_DEFAULT_REGION=sa-east-1
PG_HOST_CT=flowify-db.ci8aih10lxxb.us-east-1.rds.amazonaws.com
PG_PORT_CT=5432
PG_USER_CT=flowifyapp
PG_PASSWORD_CT=flow2015?
PG_DB_NAME_CT=flowifydb
REPORT_URL=http://api.cedimtech.com.br/report/
PDF_REQUEST_ACCESS_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE4Njc1MDI5MDAsInN1YiI6MTAwMX0.hoYvo6Et293b4vuGMhUW6RtUY8z5Ro90LvYRapC-fyw
EMAIL_SENDER=noreply@cedimvet.com.br
EMAIL_PASS=Cedim@2023!!
EMAIL_SMTP=email-ssl.com.br
EMAIL_PORT=465
DRIVE_DISK=local' > .env

#install node modules
npm install --production

# start pm2
pm2 start server-api
