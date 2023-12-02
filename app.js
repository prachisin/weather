const express = require('express');
const axios = require('axios');

const app = express();


app.get('/weather', async (req, res) => {
    try {
        const apiKey = '2e964a6391083e992732d95ecdc41686';
        const cityName = req.query.city || 'Chunar'; // Use the provided city name or default to 'Chunar'
        const response = await axios.get('http://api.weatherstack.com/current', {
            params: {
                access_key: apiKey,
                query: cityName,
            },
        });

        const apiResponse = response.data;

        // Check if the expected properties exist in the response
        if (apiResponse.location && apiResponse.location.name && apiResponse.current && apiResponse.current.temperature) {
            // Get the weather condition and find the corresponding image URL
            const condition = apiResponse.current.weather_descriptions[0];
           
            // Log condition and conditionImageUrl for debugging
            console.log('Condition:', condition);
          

            // Construct an HTML page with the weather information, image, and a form to change the location
            const htmlResponse = `
            <html>
            <head>
              <title>Weather Information</title>
              <style>
                body {
                
                  background-image: url('https://img.freepik.com/premium-photo/thunder-storm-sky-rain-clouds_37874-1989.jpg?size=626&ext=jpg&uid=R114352545&ga=GA1.1.1793935458.1696674665&semt=ais');
                  background-size: cover;
                  color: white;
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin: 0;
                  padding: 0;
                  height: 100vh; /* Adjust as needed */
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
          
                #card {
                  background: rgba(0, 0, 0, 0.5); /* Adjust the transparency (0 to 1) */
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }
          
                form {
                  margin-top: 20px;
                }
          
                img {
                  margin-top: 10px;
                  border-radius: 5px;
                }
          
                button {
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div id="card">
                <h1>${apiResponse.location.name}</h1>
                <p>Temperature: ${apiResponse.current.temperature}°C</p>
                <p>Condition: ${condition}</p>
                <form action="/weather" method="get">
                  <label for="city">Change Location:</label>
                  <input type="text" id="city" name="city" placeholder="Enter city">
                  <button type="submit">Submit</button>
                </form>
               
              </div>
            </body>
          </html>
          
      `;

            // Send the HTML response
            res.send(htmlResponse);
        } else {
            // If expected properties are not present, send an error response
            console.error('Invalid weather data received:', apiResponse);
            res.status(500).send('Invalid Weather Data Received');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
