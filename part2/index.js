const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
let response;

exports.handler = async (event) => {

  console.log("EVENT:", event)

  switch(event.resource) {
    
    case '/getProduct': 
      response = await getProduct(event);
      break;
    case '/createProduct':
      response = await createProduct(event);
      break;
    case '/listProducts':
      response = await listProducts();
      break;
    default: 
      return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid resource' })
             };
             
  }
  
  return response;

};

async function getProduct(event){
  const body = JSON.parse(event.body);
  const productId = body.Id;
  console.log("productId")

  const params = {
      TableName: 'Model',
      Key: { 'Id': productId }
  };
  
  try{
    
    response = await dynamoDB.get(params).promise();
    if(response.Item){
      return {
            statusCode: 200,
            body: JSON.stringify(response.Item)
        };
    } else {
      return {
            statusCode: 200,
            body: JSON.stringify({message: "Product not found"})
        };
    }
    
  }catch(e) {
    console.log("error", e)
    return {
      "statusCode": 500,
      "body": JSON.stringify(e)
    }
  }
  
}

async function createProduct(event){
  const body = JSON.parse(event.body);
  
  //generate unique id for product
  const productId = uuidv4();
  
  // validate color 
  const allowedColours = ['red', 'blue', 'green'];
    if (!allowedColours.includes(body.colour)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid color'})
        };
    }
    
  const params = {
        TableName: 'Model',
        Item: {
            'Id': productId,
            'name': body.name,
            'description': body.description,
            'colour': body.colour,
            'price_cents': body.price_cents
        }
    };
    
  try {
    
    response = await dynamoDB.put(params).promise();
    return {
      "statusCode": 200,
      "body": JSON.stringify({message: "Created Successfully"})
    }
    
  } catch(e) {
    console.log("error", e)
    return {
      "statusCode": 500,
      "body": JSON.stringify(e)
    }
  }
  
}

async function listProducts(){
  
  const params = {
        TableName: 'Model'
    };
    
  try{
    
    response = await dynamoDB.scan(params).promise();
    return {
      statusCode: "200",
      body: JSON.stringify(response['Items'])
    }
    
  } catch (e) {
    console.log("error", e)
    return {
      "statusCode": 500,
      "body": JSON.stringify(e)
    }
  }
  
  
}


