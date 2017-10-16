# Family Search Grave Mapper

![Example of the result](./images/example-screenshot.PNG)

This web app creates a visualization of where your ancestors are buried. You can use this to find ancestors buried near you so you can visit their grave sites. Have fun! 

## Setting up config.js
Create a file, called config.js, with these properties exported on a variable called config:

### mapsAPIKey
API key for the Google Maps Javscript API. You can get one [here](https://developers.google.com/maps/documentation/javascript/)

### rootPersonId
The family search person id of the person who's ancestors you want to get burial data for. This will probably be yourself, so you can see ancestors with burial sites near you.

### auth
Go to www.familysearch.org/tree/, and open the chrome developer tools. Go to the **network** tab, and click on **XHR** to only show XHR requests. Click on a random person on your tree to make their info card pop up. In the network tab, you should see a request to the `card` endpoint. Click on that request to show its details, and copy everything listed in the `authorization` property under **Request Headers**.

### cookie
Follow the steps above, and copy the `cookie` property under **Request Headers**.

## Run it
First, run `npm install`, and then `npm run fetchData` to download all the ancestor's data from family search. Then, run `npm start` to start the web app, and go to a browser. It should automatically open the app in a new tab. 
