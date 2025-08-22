# api/FantasyTiersScraper/__init__.py
import logging
import json
import requests
from bs4 import BeautifulSoup
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        # Define the URL to scrape
        url = 'https://www.borischen.co/p/half-ppr-draft-tiers.html'
        
        # Fetch the HTML content from the website
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # The following logic is a conceptual example based on the site's structure.
        # You would need to inspect the actual HTML to get the correct selectors.
        players_data = []
        player_id_counter = 1
        current_tier = ""
        
        # Find all the tier headers and player lists
        for element in soup.find_all(['h2', 'li']):
            if element.name == 'h2':
                current_tier = element.text.strip()
            elif element.name == 'li':
                # Assuming player info is inside <li> tags
                player_text = element.text.strip()
                if player_text and current_tier:
                    # Parse player details (this is a simplified example)
                    # A more robust parser would be needed for production
                    parts = player_text.split('(')
                    name = parts[0].strip()
                    details = parts[1].split(')')
                    position_team = details[0].strip()
                    pos, team = position_team.split(' - ')
                    
                    players_data.append({
                        'id': player_id_counter,
                        'name': name,
                        'position': pos,
                        'team': team,
                        'adp': 0, # The CSV from borischen.co gives ADP, but we need to derive it here.
                        'tier': current_tier
                    })
                    player_id_counter += 1
                    
        # Return the data as a JSON response
        return func.HttpResponse(
            json.dumps(players_data),
            mimetype="application/json",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error scraping data: {e}")
        return func.HttpResponse(
            "An error occurred while scraping fantasy data.",
            status_code=500
        )