import json
import boto3
import os

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE_NAME'])

def handler(event, context):
    """
    Sample Lambda function that interacts with DynamoDB
    """
    try:
        # Example: Put an item in DynamoDB
        if event.get('action') == 'put':
            response = table.put_item(
                Item={
                    'id': event.get('id', 'default-id'),
                    'data': event.get('data', 'default-data'),
                    'timestamp': context.aws_request_id
                }
            )
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Item successfully added to DynamoDB',
                    'table': '${table_name}',
                    'response': response
                })
            }
        
        # Example: Get an item from DynamoDB
        elif event.get('action') == 'get':
            response = table.get_item(
                Key={
                    'id': event.get('id', 'default-id')
                }
            )
            
            if 'Item' in response:
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'message': 'Item found',
                        'item': response['Item']
                    }, default=str)
                }
            else:
                return {
                    'statusCode': 404,
                    'body': json.dumps({
                        'message': 'Item not found'
                    })
                }
        
        # Default response
        else:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Lambda function executed successfully',
                    'table': '${table_name}',
                    'usage': 'Send action=put with id and data to add items, or action=get with id to retrieve items'
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error occurred',
                'error': str(e)
            })
        }