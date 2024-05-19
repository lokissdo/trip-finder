import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_destinations(url):
    response = requests.get(url, verify=False)

    if response.status_code == 200:
        html_content = response.text

        soup = BeautifulSoup(html_content, "html.parser")
        destinations = soup.find_all("h3")
    else:
        print("Failed to fetch the webpage:", response.status_code)
        return None

    names = []
    img_urls = []
    addresses = []
    ticket_prices = []
    opening_hours_list = []
    descriptions = []

    # Extract information for each destination
    for destination in destinations:
        names.append(destination.text.strip())
        img_tag = destination.find_next("img")
        img_urls.append(img_tag["src"] if img_tag else "")  
        info_ul = destination.find_next("ul")  
        address_li = info_ul.find_all("li")
        addresses.append(address_li[0].text.strip() if len(address_li) > 0 else "")  
        opening_hours_list.append(address_li[1].text.strip() if len(address_li) > 1 else "")  
        ticket_prices.append(address_li[2].text.strip() if len(address_li) > 2 else "")  

        # Find the next <p> tag containing the description
        temp = destination.find_next("p")
        description_p = temp.find_next("p")
        descriptions.append(description_p.text.strip() if description_p else "")

    data = {
        "name": names,
        "img_url": img_urls,
        "address": addresses,
        "price": ticket_prices,
        "opening_hours": opening_hours_list,
        "description": descriptions
    }

    df = pd.DataFrame(data)
    return df


# usage
url = "https://www.dongtravel.com/blog/phu-quoc/dia-diem-du-lich-phu-quoc"
phu_quoc_attractions = scrape_destinations(url)
print(phu_quoc_attractions)
