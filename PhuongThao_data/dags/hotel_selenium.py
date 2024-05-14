import datetime
import csv
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, WebDriverException
import time

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
        ("Hà Nội", "https://www.google.com/maps/search/kh%C3%A1ch+s%E1%BA%A1n+%E1%BB%9F+h%C3%A0+n%E1%BB%99i/@21.0293273,105.8390507,14z/data=!3m1!4b1!4m7!2m6!5m4!5m3!1s{formatted_date}!4m1!1i1!6e3?hl=vi&entry=ttu"),
        ("Phú Quốc", "https://www.google.com/maps/search/kh%C3%A1ch+s%E1%BA%A1n+%E1%BB%9F+ph%C3%BA+qu%E1%BB%91c/@10.1836554,103.766236,11z/data=!4m7!2m6!5m4!5m3!1s{formatted_date}!4m1!1i1!6e3?authuser=0&hl=vi&entry=ttu")
    ]

    start_date = datetime.datetime(2024, 6, 1)  
    end_date = datetime.datetime(2024, 6, 7)

    try:
        driver = webdriver.Chrome()

        for province, url_template in provinces:
            print(f"Scraping data for {province}:")
            current_date = start_date
            province_data = {}  
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

                province_data[formatted_date] = hotel_names 
                province_data['current_time'] = get_current_utc_time()
                print("-" * 50)  
                current_date = next_day  

                # Lưu dữ liệu vào file CSV cho từng tỉnh/thành phố
                csv_filename = f"/Users/thao/datalake/{province.replace(' ', '_')}_hotels.csv"

                # Viết dữ liệu vào CSV
                csv_columns = ["name", "link", "rating", "image_url", "standard", "price", "description", "platform", "price_platform", "url_platform", "checkin", "checkout", "province", "current_time"]

                try:
                    file_exists = os.path.isfile(csv_filename)
                    with open(csv_filename, 'a', newline='', encoding='utf-8') as csv_file:
                        writer = csv.DictWriter(csv_file, fieldnames=csv_columns)
                        if not file_exists:
                            writer.writeheader()
                        for hotel in hotel_names:
                            writer.writerow(hotel)
                except Exception as e:
                    print(f"Error saving data to CSV file for {province}: {e}")

    except WebDriverException as e:
        print(f"Error initiating WebDriver: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

       
