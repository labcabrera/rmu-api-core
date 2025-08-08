const axios = require('axios');

const testData = {
  "id": "test-elf",
  "name": "Test Elf",
  "realm": "lotr",
  "size": "Medium",
  "defaultStatBonus": {
    "ag": 5,
    "co": 0,
    "em": 0,
    "in": 5,
    "me": 0,
    "pr": 5,
    "qu": 5,
    "re": 0,
    "sd": 0,
    "st": -5
  },
  "resistances": {
    "channeling": 0,
    "mentalism": 0,
    "essence": 10,
    "physical": 0
  },
  "averageHeight": {
    "male": 180,
    "female": 170
  },
  "averageWeight": {
    "male": 70,
    "female": 60
  },
  "strideBonus": 5,
  "enduranceBonus": 0,
  "recoveryMultiplier": 1.0,
  "baseHits": 0,
  "bonusDevPoints": 10,
  "description": "Test elf race for debugging"
};

async function testRaceCreation() {
  try {
    console.log('Testing race creation endpoint...');
    console.log('Request data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post('http://localhost:3001/v1/races', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    console.log('Error message:', error.message);
  }
}

testRaceCreation();
