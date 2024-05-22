import datetime
import csv
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, WebDriverException
import time
from azure.storage.blob import BlobServiceClient
import io

connection_string = "DefaultEndpointsProtocol=https;AccountName=datalakegroup10;AccountKey=OaZXaAK7tDLzMih9jwkU57hXfyus9mDCXxO4HVtKrCr9Y2PYx9QvKQhFrRfvB0z895rH9wvFwPa3+AStq6y0aQ==;EndpointSuffix=core.windows.net"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

def save_to_azure_blob(hotel_data, province):
    container_name = datetime.datetime.utcnow().strftime('%Y-%m-%d')
    blob_name = f"{province.replace(' ', '_')}_hotels.csv"
    
    try:
        container_client = blob_service_client.get_container_client(container_name)
        if not container_client.exists():
            container_client.create_container()
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
        blob_data = io.BytesIO()
        writer = csv.DictWriter(blob_data, fieldnames=hotel_data[0].keys())
        writer.writeheader()
        writer.writerows(hotel_data)
        blob_data.seek(0)
        blob_client.upload_blob(blob_data, overwrite=True)

        print(f"Saved {blob_name} to Azure Blob Storage in container {container_name}.")
    except Exception as e:
        print(f"Error saving {blob_name} to Azure Blob Storage: {e}")

def get_current_utc_time():
    return datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')

def get_hotel_names(driver, url, province, checkin, checkout):
    driver.get(url)
    try:
        WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "form:nth-child(2)"))
        ).click()
    except Exception:
        pass

    scrollable_div = driver.find_element(By.CSS_SELECTOR, 'div[role="feed"]')

    driver.set_script_timeout(300)

    driver.execute_script(
    """
    var scrollableDiv = arguments[0];

    function scrollWithinElement(scrollableDiv) {
        return new Promise((resolve, reject) => {
            var distance = 1000;
            var scrollDelay = 5000;

            function scrollStep() {
                var scrollHeightBefore = scrollableDiv.scrollHeight;
                scrollableDiv.scrollBy(0, distance);

                setTimeout(() => {
                    var scrollHeightAfter = scrollableDiv.scrollHeight;
                    var reachedBottom = scrollableDiv.scrollTop + scrollableDiv.clientHeight >= scrollableDiv.scrollHeight;

                    if (reachedBottom && scrollHeightAfter <= scrollHeightBefore) {
                        resolve(); // Stop if no more content is loaded
                    } else {
                        scrollStep(); // Continue scrolling
                    }
                }, scrollDelay);
            }

            scrollStep();
        });
    }

    return scrollWithinElement(scrollableDiv);
    """,
    scrollable_div,
)

    items = driver.find_elements(
        By.XPATH, '//div[@role="feed"]//a[@aria-label and starts-with(@href, "https://www.google.com/maps")]'
    )
    print(f"Found {len(items)} items")

    hotels = []

    for item in items:
        data = {}
        try:
            item.click()
        
            time.sleep(7)
        except Exception:
            pass
        
        try:
            name_element = driver.find_element(By.XPATH, '//h1[@class="DUwDvf lfPIob"]')
            if name_element:
                name = name_element.text.strip()
                data["name"] = name
        except Exception:
            pass

        try:
            link_element = driver.find_element(By.XPATH, '//div[@class="Nv2PK THOPZb CpccDe CdoAJb"]//a[@aria-label]')
            if link_element:
                link = link_element.get_attribute("href")
                data["link"] = link  
        except Exception:
            pass

        try:
            rating_element = driver.find_element(By.XPATH, '//div[@class="fontBodyMedium dmRWX"]/div[2]/span[1]/span[1]')
            if rating_element:
                rating = rating_element.text.strip()
                data["rating"] = rating  
        except Exception:
            pass

        try:
            img_element = driver.find_element(By.XPATH, '//div[@class="ZKCDEc"]/div[1]/button[1]/img[1]')
            if img_element:
                image_url = img_element.get_attribute("src")
                data["image_url"] = image_url
        except Exception:
            pass

        try:
            standard_element = driver.find_element(By.XPATH, '//div[@class="fontBodyMedium dmRWX"]/span[1]/span[1]/span[1]/span[2]/span[1]/span[1]')
            if standard_element:
                standard_text = standard_element.text.strip()
                if "Khách sạn" in standard_text:
                    data["standard"] = standard_text
        except Exception:
            pass
        
        try:
            price_element = driver.find_element(By.CSS_SELECTOR, '.dkgw2 > span.fontTitleLarge')
            if price_element:
                price_text = price_element.text.strip()
                price = float(price_text.replace('₫', '').replace('.', '').replace(',', '.'))
                data["price"] = price
        except Exception:
            pass

        try:
            description_element = driver.find_element(By.CSS_SELECTOR, '.MmD1mb')
            if description_element:
                description_text = description_element.text.strip()
                data["description"] = description_text
        except Exception:
            pass

        try:
            suggestion = []
            item2_elements = item.find_elements(By.XPATH, '//a[contains(@class, "SlvSdc") and contains(@class, "co54Ed")]')
            for item2 in item2_elements:
                data1 = {}
                platform = item2.find_element(By.CSS_SELECTOR, '.QVR4f').text.strip()
                price_platform_text = item2.find_element(By.CSS_SELECTOR, '.pUBf3e').text.strip()
                price_platform = float(price_platform_text.replace('₫', '').replace('.', '').replace(',', '.'))
                url_platform = item2.get_attribute('data-attribution-url')
   
                data1["platform"] = platform
                data1["price_platform"] = price_platform
                data1["url_platform"] = url_platform  
                suggestion.append(data1)
        except Exception:
            pass
        if not suggestion:
            suggestion = [{}]

        data["checkin"] = checkin
        data["checkout"] = checkout
        data["province"] = province
        data["current_time"] = get_current_utc_time()

        try:
            for doc in suggestion:
                merged_data = data.copy()  
                merged_data.update(doc)  
                hotels.append(merged_data)
        except Exception:
            pass 

    return hotels

def main():
    provinces = [
        ("TP Hồ Chí Minh", "https://www.google.com/maps/search/kh%C3%A1ch+s%E1%BA%A1n+%E1%BB%9F+h%E1%BB%93+ch%C3%AD+minh/@10.8023364,106.635526,13z/data=!3m1!4b1!4m7!2m6!5m4!5m3!1s{formatted_date}!4m1!1i1!6e3?hl=vi-VN&entry=ttu"),
        ("Đà Nẵng", "https://www.google.com/maps/search/kh%C3%A1ch+s%E1%BA%A1n+%E1%BB%9F+%C4%91%C3%A0+n%E1%BA%B5ng/@16.0551159,108.2063926,14z/data=!3m1!4b1!4m7!2m6!5m4!5m3!1s{formatted_date}!4m1!1i1!6e3?hl=vi-VN&entry=ttu"),
        ("Hà Nội", "https://www.google.com/maps/search/kh%C3%A1ch+s%E1%BA%A1n+%E1%BB%9F+h%C3%A0+n%E1%BB%99i/@21.0293273,105.8390507,14z/data=!3m1!4b1!4m7!2m6!5m4!5m3!1s{formatted_date}!4m1!1i1!6e3?hl=vi&entry=ttu"),
        ("Phú Quốc", "https://www.google.com/maps/search/kh%C3%A1ch+s%E1%BA%A1n+%E1%BB%9F+ph%C3%BA+qu%E1%BB%91c/@10.1836554,103.766236,11z/data=!4m7!2m6!5m4!5m3!1s{formatted_date}!4m1!1i1!6e3?authuser=0&hl=vi&entry=ttu"),
        ("Quảng Nam", "https://www.google.com/maps/search/kh%C3%A1ch+s%E1%BA%A1n+%E1%BB%9F+qu%E1%BA%A3ng+nam/@15.7000862,108.2734714,10.45z/data=!4m7!2m6!5m4!5m3!1s{formatted_date}!4m1!1i1!6e3?hl=vi-VN&entry=ttu"),
    ]

    start_date = datetime.datetime(2024, 6, 1)  
    end_date = datetime.datetime(2024, 6, 7)

    try:
        driver = webdriver.Chrome()

        for province, url_template in provinces:
            print(f"Scraping data for {province}:")
            current_date = start_date
            province_data = []  
            while current_date <= end_date:
                next_day = current_date + datetime.timedelta(days=1)
                formatted_date = current_date.strftime("%Y-%m-%d")
                next_formatted_date = next_day.strftime("%Y-%m-%d")
                url = url_template.format(formatted_date=formatted_date)
                print(f"Scraping data from URL: {url}")
                hotel_names = get_hotel_names(driver, url, province, formatted_date, next_formatted_date)
                print("Scraping completed. Found names for the following hotels:")
                for name in hotel_names:
                    print(name)
                assert len(hotel_names) > 0, "No hotel names found"

                province_data.extend(hotel_names)  
                current_date = next_day  

                print("-" * 50)


            if province_data:
                save_to_azure_blob(province_data, province)

    except WebDriverException as e:
        print(f"Error initiating WebDriver: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
