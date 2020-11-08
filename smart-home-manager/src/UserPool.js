import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_lpx9d2EPA',
  ClientId: '17mn48rg7ihmiri0sqsaj6vpgn'
};

export default new CognitoUserPool(poolData)