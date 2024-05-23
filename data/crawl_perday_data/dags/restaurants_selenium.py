import datetime
import csv
import time
import io
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, ElementNotInteractableException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from azure.storage.blob import BlobServiceClient

# Azure Blob Storage connection string
connection_string = "DefaultEndpointsProtocol=https;AccountName=datalakegroup10;AccountKey=OaZXaAK7tDLzMih9jwkU57hXfyus9mDCXxO4HVtKrCr9Y2PYx9QvKQhFrRfvB0z895rH9wvFwPa3+AStq6y0aQ==;EndpointSuffix=core.windows.net"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

def save_to_azure_blob(data, province, prefix):
    """
    Saves restaurant data to Azure Blob Storage.

    Args:
        data (list): List of dictionaries containing restaurant data.
        province (str): The province where the restaurants are located.
        prefix (str): Prefix for the blob container.

    Returns:
        None
    """
    container_name = f"{prefix}_{datetime.datetime.utcnow().strftime('%Y-%m-%d')}"
    blob_name = f"{province.replace(' ', '_')}.csv"
    
    try:
        container_client = blob_service_client.get_container_client(container_name)
        if not container_client.exists():
            container_client.create_container()
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
        blob_data = io.BytesIO()
        writer = csv.DictWriter(blob_data, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        blob_data.seek(0)
        blob_client.upload_blob(blob_data, overwrite=True)

        print(f"Saved {blob_name} to Azure Blob Storage in container {container_name}.")
    except Exception as e:
        print(f"Error saving {blob_name} to Azure Blob Storage: {e}")

def extract_restaurant_data(driver, province):
    """
    Extracts restaurant data from the web page.

    Args:
        driver: Selenium WebDriver instance.
        province (str): The province where the restaurants are located.

    Returns:
        dict: Dictionary containing restaurant data.
    """
    try:
        name = driver.find_element(By.XPATH, '//h1[@class="biGQs _P egaXP rRtyp"]').text
        rating = driver.find_element(By.XPATH, '//span[@class="biGQs _P fiohW uuBRH"]').text
        link = driver.find_element(By.XPATH, '//link[@rel="canonical"]').get_attribute('href')
        price = driver.find_element(By.XPATH, '(//div[@class="MJ"]/div[@class="biGQs _P pZUbB alXOW oCpZu GzNcM nvOhm UTQMg ZTpaU W hmDzD"])[1]').text
        style = driver.find_element(By.XPATH, '(//div[@class="MJ"]/div[@class="biGQs _P pZUbB alXOW oCpZu GzNcM nvOhm UTQMg ZTpaU W hmDzD"])[2]').text
        description = driver.find_element(By.XPATH, '(//div[@class="MJ"]/div[@class="biGQs _P pZUbB alXOW oCpZu GzNcM nvOhm UTQMg ZTpaU W hmDzD"])[3]').text
        image = driver.find_element(By.XPATH, '//div[@class="afQPz SyjMH UvOYC ufZCe o Ra BUFvN"]/button[2]/picture[1]/img[1]').get_attribute('src')
        
        restaurant_data = {
            "name": name,
            "rating": rating,
            "link": link,
            "price": price,
            "style": style,
            "description": description,
            "image": image,
            "province": province
        }
        return restaurant_data
    except Exception as e:
        print(f"Error extracting data: {e}")
        return None
    finally:
        driver.back()
        time.sleep(7)

def go_to_next_page(driver):
    """
    Navigates to the next page of restaurant listings.

    Args:
        driver: Selenium WebDriver instance.

    Returns:
        bool: True if successfully navigated to the next page, False otherwise.
    """
    try:
        next_button = driver.find_element(By.XPATH, '//div[@class="xkSty"]/div[1]/a[1]')
        next_button.click()
        time.sleep(8)
    except Exception as e:
        print(f"No more pages: {e}")
        return False
    return True

def crawl_restaurants(driver, geo, province):
    """
    Crawls restaurant data for a specific province.

    Args:
        driver: Selenium WebDriver instance.
        geo (int): Geo location code for the province.
        province (str): The province where the restaurants are located.

    Returns:
        list: List of dictionaries containing restaurant data.
    """
    url = f"https://www.tripadvisor.com.vn/FindRestaurants?geo={geo}&cuisines=10675%2C10659%2C10679%2C10642&establishmentTypes=10591%2C9900%2C11776%2C9909&mealTypes=10597%2C10606%2C10598%2C10599&broadened=true"
    driver.get(url)
    time.sleep(10)

    all_restaurant_data = []

    while True:
        items = driver.find_elements(By.XPATH, '//div[@class="vIjFZ Gi o VOEhq"]')
        for item in items:
            try:
                link = item.find_element(By.XPATH, './/a')
                link.click()
                time.sleep(7)
                restaurant_data = extract_restaurant_data(driver, province)
                if restaurant_data:
                    all_restaurant_data.append(restaurant_data)
            except Exception as e:
                print(f"Error clicking item: {e}")
        if not go_to_next_page(driver):
            break

    return all_restaurant_data

def main():
    provinces = [
        {"geo": 293924, "province": "Hà Nội"},
        {"geo": 293925, "province": "TP Hồ Chí Minh"},
        {"geo": 298085, "province": "Đà Nẵng"},
        {"geo": 1184679, "province": "Phú Quốc"},
        {"geo": 2146272, "province": "Quảng Nam"}
    ]

    try:
        driver = webdriver.Chrome()
        for city in provinces:
            print(f"Scraping data for {city['province']}:")
            restaurant_data = crawl_restaurants(driver, city["geo"], city["province"])
            if restaurant_data:
                save_to_azure_blob(restaurant_data, city["province"], prefix="restaurants")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
