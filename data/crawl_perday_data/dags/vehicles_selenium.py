import datetime
import csv
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException
import time
import io

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


def get_current_utc_time():
    return datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

def get_vehicle_names(driver, url, departure, arrival):
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
                  var totalHeight = 0;
                  var distance = 1000;
                  var scrollDelay = 5000;
                  
                  var timer = setInterval(() => {
                      var scrollHeightBefore = scrollableDiv.scrollHeight;
                      scrollableDiv.scrollBy(0, distance);
                      totalHeight += distance;
                      if (totalHeight >= scrollHeightBefore) {
                          totalHeight = 0;
                          setTimeout(() => {
                              var scrollHeightAfter = scrollableDiv.scrollHeight;
                              if (scrollHeightAfter > scrollHeightBefore) {
                                  return;
                              } else {
                                  clearInterval(timer);
                                  resolve();
                              }
                          }, scrollDelay);
                      }
                  }, 5000);
              });
          }
          return scrollWithinElement(scrollableDiv);
        """,
        scrollable_div,
    )

    items = driver.find_elements(
        By.XPATH, '//*[@id="yDmH0d"]/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[2]/div[3]/ul/li[1]/div'
    )
    print(f"Found {len(items)} items")

    flights = []

    for item in items:
        data = {}
        try:
            item.click()
        
            time.sleep(5)
        except Exception:
            pass
        
        try:
            name_element = driver.find_element(By.XPATH, '//*[@id="yDmH0d"]/c-wiz[2]/div/div[2]/c-wiz/div[1]/c-wiz/div[2]/div[2]/div[3]/ul/li[1]/div/div[2]/div/div[11]/div[1]/span[8]')
            if name_element:
                name = name_element.text.strip()
                data["name"] = name
        except Exception:
            pass
        
        try:
            price_element = driver.find_element(By.CSS_SELECTOR, '.dkgw2 > span.fontTitleLarge')
            if price_element:
                price_text = price_element.text.strip()
                price = float(price_text.replace('₫', '').replace('.', '').replace(',', ''))
                data["price"] = price
                data["departure"] = departure
                data["arrival"] = arrival
        except Exception:
            pass

        try:
            description_element = driver.find_element(By.CSS_SELECTOR, '.MmD1mb')
            if description_element:
                description_text = description_element.text.strip()
                data["detail"] = description_text
        except Exception:
            pass

        try:
            suggestion = []
            item2_elements = item.find_elements(By.XPATH, '//a[contains(@class, "SlvSdc") and contains(@class, "co54Ed")]')
            for item2 in item2_elements:
                data1 = {}
                suggestion.append(data1)
        except Exception:
            pass
        if not suggestion:
            suggestion = [{}]

        data["current_time"] = get_current_utc_time()

        try:
            for doc in suggestion:
                merged_data = data.copy()  
                merged_data.update(doc)  
                flights.append(merged_data)
        except Exception:
            pass 

    return flights

def main():
    routes = [
        ("SGN-DAD", "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI0LTA2LTAxagcIARIDREFEcgcIARIDU0dOQAFIAXABggELCP___________wGYAQI"),
        ("DAD-SGN", "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI0LTA2LTAxagcIARIDU0dOcgcIARIDREFEQAFIAXABggELCP___________wGYAQI"),
        ("SGN-HAN", "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI0LTA2LTAxagcIARIDU0dOcgcIARIDSEFOQAFIAXABggELCP___________wGYAQI"),
        ("HAN-SGN", "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI0LTA2LTAxagcIARIDSEFOcgcIARIDU0dOQAFIAXABggELCP___________wGYAQI"),
        ("SGN-PQC", "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI0LTA2LTAxagcIARIDU0dOcgcIARIDUFFDQAFIAXABggELCP___________wGYAQI"),
        ("PQC-SGN", "https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI0LTA2LTAxagcIARIDUFFDcgcIARIDU0dOQAFIAXABggELCP___________wGYAQI")
    ]

    start_date = datetime.datetime(2024, 6, 1)  
    end_date = datetime.datetime(2024, 6, 7)

    try:
        driver = webdriver.Chrome()

        for route, url_template in routes:
            print(f"Scraping data for {route}:")
            current_date = start_date
            province_data = {}  
            while current_date <= end_date:
                next_day = current_date + datetime.timedelta(days=1)
                formatted_date = current_date.strftime("%Y-%m-%d")
                next_formatted_date = next_day.strftime("%Y-%m-%d")
                url = url_template.format(formatted_date=formatted_date)
                print(f"Scraping data from URL: {url}")
                flight_names = get_vehicle_names(driver, url, route, formatted_date, next_formatted_date)
                print("Scraping completed. Found the following flights:")
                for name in flight_names:
                    print(name)
                assert len(flight_names) > 0, "No flights names found"

                province_data[formatted_date] = flight_names 
                province_data['current_time'] = get_current_utc_time()
                print("-" * 50)  
                current_date = next_day  

                csv_filename = f"/Users/haqn/datalake/{route.replace(' ', '_')}_flights.csv"

                csv_columns = ["brand", "image_url", "price", "description", "departure", "arrival", "departureTime", "arrivalTime", "platform", "province", "current_time"]

                try:
                    file_exists = os.path.isfile(csv_filename)
                    with open(csv_filename, 'a', newline='', encoding='utf-8') as csv_file:
                        writer = csv.DictWriter(csv_file, fieldnames=csv_columns)
                        if not file_exists:
                            writer.writeheader()
                        for flight in flight_names:
                            writer.writerow(flight)
                except Exception as e:
                    print(f"Error saving data to CSV file for {route}: {e}")

    except WebDriverException as e:
        print(f"Error initiating WebDriver: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

       
