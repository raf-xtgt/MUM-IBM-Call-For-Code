from ibm_botocore.client import Config
import ibm_boto3

cos = ibm_boto3.client(service_name='s3',
                       ibm_api_key_id="zyOt9KPm8yILmtbgNDiY58BprxTrYcoapTC5lfhwPaUA",
                       ibm_service_instance_id="crn:v1:bluemix:public:cloud-object-storage:global:a/1f5db8d71e7e4a34960bfd1ae65f6f59:251df88d-9ef0-4e96-9621-fcafd09bb803:bucket:mum-callforcode",
                       ibm_auth_endpoint="https://iam.cloud.ibm.com/identity/token",
                       config=Config(signature_version='oauth'),
                       endpoint_url="https://s3.eu-gb.cloud-object-storage.appdomain.cloud")

def UploadBlockchainToCloud():
    print("Trying to upload blockchain.json to cloud")
    try:
        cos.upload_file(Filename='blockchain.json',Bucket='mum-callforcode',Key='blockchain')
    except Exception as e:
        print(Exception,e)
    else:
        print('blockchain.json Uploaded') 

def DownloadBlockchainFromCloud():
    print("Trying to Download blockchain.json from cloud")
    try:
        file = cos.download_file(Bucket='mum-callforcode',Key='blockchain',Filename='blockchain.json')
    except Exception as e:
        print(Exception,e)
    else:
        print('blockchain.json Retrieved')
