import datetime
import csv
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException
import time

def get_current_utc_time():
    return datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')

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
                print("Scraping completed. Found names for the following hotels:")
                for name in flight_names:
                    print(name)
                assert len(flight_names) > 0, "No hotel names found"

                province_data[formatted_date] = flight_names 
                province_data['current_time'] = get_current_utc_time()
                print("-" * 50)  
                current_date = next_day  

                csv_filename = f"/Users/thao/datalake/{route.replace(' ', '_')}_hotels.csv"

                csv_columns = ["name", "link", "rating", "image_url", "standard", "price", "description", "platform", "price_platform", "url_platform", "checkin", "checkout", "province", "current_time"]

                try:
                    file_exists = os.path.isfile(csv_filename)
                    with open(csv_filename, 'a', newline='', encoding='utf-8') as csv_file:
                        writer = csv.DictWriter(csv_file, fieldnames=csv_columns)
                        if not file_exists:
                            writer.writeheader()
                        for hotel in flight_names:
                            writer.writerow(hotel)
                except Exception as e:
                    print(f"Error saving data to CSV file for {route}: {e}")

    except WebDriverException as e:
        print(f"Error initiating WebDriver: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

       
