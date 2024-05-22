import pandas as pd
import os
from datetime import timedelta, datetime
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import re

def parse_duration(duration):
    """
    Parse a duration string and return a timedelta object.
    
    Args:
        duration (str): A string representing a duration in the format 'X giờ Y phút'.

    Returns:
        timedelta: A timedelta object representing the parsed duration.

    """
    if 'giờ' in duration:
        hours = int(duration.split(' giờ')[0])
        if 'phút' in duration:
            minutes = int(duration.split(' giờ')[1].split(' phút')[0])
        else:
            minutes = 0
    elif 'phút' in duration:
        hours = 0
        minutes = int(duration.split(' phút')[0])
    else:
        return None
    return timedelta(hours=hours, minutes=minutes)

def bus_preprocess(data):
    """
    Preprocess bus data.
    Args:
        data (DataFrame): Input DataFrame containing bus data.

    Returns:
        DataFrame: Preprocessed DataFrame.

    """
    data.rename(columns={'name':'brand'},inplace=True)
    mapping = {
        'Sai Gon': 'TP Hồ Chí Minh',
        'Ha Noi': 'Hà Nội',
        'Kien Giang': 'Kiên Giang',
        'Da Nang': 'Đà Nẵng',
        'Nghe An': 'Nghệ An',
        'Hue': 'Huế',
        'Khanh Hoa': 'Khánh Hòa',
        'Lam Dong': 'Lâm Đồng',
        'Binh Dinh': 'Bình Định',
        'Can Tho': 'Cần Thơ',
        'Quang Ninh': 'Quảng Ninh',
        'Phu Yen': 'Phú Yên',
        'Gia Lai': 'Gia Lai',
        'Dak Lak': 'Đắk Lăk',
        'Ba Ria - Vung Tau': 'Bà Rịa - Vũng Tàu',
        'An Giang': 'An Giang',
        'Bac Giang': 'Bắc Giang',
        'Bac Kan': 'Bắc Kạn',
        'Bac Lieu': 'Bạc Liêu',
        'Bac Ninh': 'Bắc Ninh',
        'Ben Tre': 'Bến Tre',
        'Binh Duong': 'Bình Dương',
        'Binh Phuoc': 'Bình Phước',
        'Binh Thuan': 'Bình Thuận',
        'Ca Mau': 'Cà Mau',
        'Cao Bang': 'Cao Bằng',
        'Dak Nong': 'Đắk Nông',
        'Dien Bien': 'Điện Biên',
        'Dong Nai': 'Đồng Nai',
        'Dong Thap': 'Đồng Tháp',
        'Ha Giang': 'Hà Giang',
        'Ha Nam': 'Hà Nam',
        'Ha Tinh': 'Hà Tĩnh',
        'Hai Duong': 'Hải Dương',
        'Hau Giang': 'Hậu Giang',
        'Hoa Binh': 'Hòa Bình',
        'Hung Yen': 'Hưng Yên',
        'Kon Tum': 'Kon Tum',
        'Lai Chau': 'Lai Châu',
        'Lang Son': 'Lạng Sơn',
        'Lao Cai': 'Lào Cai',
        'Long An': 'Long An',
        'Nam Dinh': 'Nam Định',
        'Ninh Binh': 'Ninh Bình',
        'Ninh Thuan': 'Ninh Thuận',
        'Phu Tho': 'Phú Thọ',
        'Quang Binh': 'Quảng Bình',
        'Quang Nam': 'Quảng Nam',
        'Quang Ngai': 'Quảng Ngãi',
        'Quang Tri': 'Quảng Trị',
        'Soc Trang': 'Sóc Trăng',
        'Son La': 'Sơn La',
        'Tay Ninh': 'Tây Ninh',
        'Thai Binh': 'Thái Bình',
        'Thai Nguyen': 'Thái Nguyên',
        'Thanh Hoa': 'Thanh Hóa',
        'Thua Thien Hue': 'Thừa Thiên Huế',
        'Tien Giang': 'Tiền Giang',
        'Tra Vinh': 'Trà Vinh',
        'Tuyen Quang': 'Tuyên Quang',
        'Vinh Long': 'Vĩnh Long',
        'Vinh Phuc': 'Vĩnh Phúc',
        'Yen Bai': 'Yên Bái'
    }

    data['departure'] = data['departure'].str.title().replace(mapping)
    data['arrival'] = data['arrival'].str.title().replace(mapping)

    data['rating'] = data['rating'].str.extract(r'^([\d.]+)').astype(float)
    data['date'] = pd.to_datetime(data['date'], format='%d-%m-%Y')
    data['price'] = data['price'].str.extract(r'(\d+[\.,]?\d*)').astype(float)*1000
    data['price'] = data['price'].astype(int)
    data['duration'] = [
        timedelta(
            hours=int(duration.split('h')[0]),
            minutes=int(duration.split('h')[1].split('m')[0]) if 'm' in duration else 0
        ) for duration in data['duration']
    ]
    data['duration'] = data['duration'].astype(str).apply(lambda x: x.split(' ')[-1] if x.startswith('0 days') else x)
    return data

def flight_preprocess(data):
    """
    Preprocess flight data.

    Args:
        data (DataFrame): Input DataFrame containing flight data.

    Returns:
        DataFrame: Preprocessed DataFrame.

    """
    airport_province_mapping = {
        "HAN": "Hà Nội",
        "SGN": "TP Hồ Chí Minh",
        "DAD": "Đà Nẵng",
        "VDO": "Quảng Ninh",
        "HPH": "Hải Phòng",
        "VII": "Nghệ An",
        "HUI": "Huế",
        "CXR": "Khánh Hòa",
        "DLI": "Lâm Đồng",
        "UIH": "Bình Định",
        "VCA": "Cần Thơ",
        "PQC": "Kiên Giang",
        "DIN": "Điện Biên",
        "THD": "Thanh Hóa",
        "VDH": "Quảng Bình",
        "VCL": "Quảng Nam",
        "TBB": "Phú Yên",
        "PXU": "Gia Lai",
        "BMV": "Đắk Lăk",
        "VKG": "Kiên Giang",
        "CAH": "Cà Mau",
        "VCS": "Bà Rịa - Vũng Tàu"
    }
    data['price'] = data['price'].astype(str)
    data['price'] = data['price'].str.replace('[^\d]', '', regex=True).astype(int)
    data['departure'] = data['departure'].map(airport_province_mapping)
    data['arrival'] = data['arrival'].map(airport_province_mapping)
    data = data.drop(columns = ['arrivalTime'], inplace = True)
    data.rename(columns={'flightType':'detail', 'Field2':'date'}, inplace=True)
    data['duration'] = data['duration'].apply(parse_duration)
    data['duration'] = data['duration'].astype(str).apply(lambda x: x.split(' ')[-1] if x.startswith('0 days') else x)

    formatted_dates = []
    date_strings = data['date']

    for date_string in date_strings:
        day, month = date_string.split(', ')[1].split(' thg ')
        day = day.zfill(2)
        month = month.zfill(2)
        formatted_date = f"{day}/{month}/2024"
        formatted_dates.append(formatted_date)

    data['date'] = pd.to_datetime(formatted_dates, format='%d/%m/%Y')
    data['type'] = "Máy Bay"
    return data

def vehicles_preprocess(folder_path):
    """
    Preprocess vehicle data from CSV files.

    Args:
        folder_path (str): Path to the folder containing CSV files.

    Returns:
        DataFrame: Preprocessed DataFrame.
    """
    dfs = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".csv"):
            filepath = os.path.join(folder_path, filename)
            df = pd.read_csv(filepath)
            dfs.append(df)
    data = pd.concat(dfs, ignore_index=True)
    data.dropna(subset=['name'], inplace=True)
    if data['type'].iloc[0] == "Xe Khách":
        bus_preprocess(data)
    else:
        flight_preprocess(data)
    data['updatedAt'] = datetime.now()
    return data

def get_long_lat(name):
    """
    Get latitude and longitude coordinates for a location name.

    Args:
        name (str): Name of the location.

    Returns:
        tuple: Latitude and longitude coordinates of the location.
    """
    try:
        geolocator = Nominatim(user_agent="my_user_agent", timeout=10)  # Set timeout to 10 seconds
        loc = geolocator.geocode(name)
        if loc:
            return loc.latitude, loc.longitude
        else:
            return None, None
    except (GeocoderTimedOut, Exception) as e:
        print("Error:", e)
        return None, None

def extract_prices(text):
    prices = re.findall(r'\d{1,3}(?:\.\d{3})?(?:\.\d{3})?\s*', text)
    if prices:
        return int(''.join(filter(str.isdigit, prices[0])))
    else:
        return 0

def attraction_preprocess(df):
    df['address'] = df['address'].str.replace('Địa chỉ: ', '')
    df['opening_hours'] = df['opening_hours'].str.replace('Thời gian tham quan: ', '').str.replace('Giờ mở cửa:')
    df['opening_hours'] = df['opening_hours'].str.replace('Cả ngày', 'Mở cả ngày')\
        .str.replace('Luôn mở cửa', 'Mở cả ngày').str.replace(' đến ','-').str.replace(' giờ','h00')
    df['platform']='news'
    def extract_name(description):
        parts = description.split("-")
        name = parts[0].split(".")[-1].strip()
        return name
    df['name'] = df['name'].apply(extract_name)
