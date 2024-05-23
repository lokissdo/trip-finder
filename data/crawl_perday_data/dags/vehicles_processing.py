from pyspark.sql import SparkSession
from azure.storage.blob import BlobServiceClient
from io import StringIO
from datetime import datetime, timedelta
import functools
import pandas as pd
import os

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
spark = SparkSession.builder \
    .appName("FlightDataProcessing") \
    .getOrCreate()
connection_string = "DefaultEndpointsProtocol=https;AccountName=datalakegroup10;AccountKey=OaZXaAK7tDLzMih9jwkU57hXfyus9mDCXxO4HVtKrCr9Y2PYx9QvKQhFrRfvB0z895rH9wvFwPa3+AStq6y0aQ==;EndpointSuffix=core.windows.net"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

def main(blob):
    """
    This function processes data from a CSV file and returns a Spark DataFrame.
    
    Args:
        blob: Blob object from Blob Storage
    
    Returns:
        DataFrame: Processed Spark DataFrame
    """
    blob_client = blob_service_client.get_blob_client(container=blob.container_name, blob=blob.name)
    data = blob_client.download_blob().readall().decode("utf-8")
    
    df = spark.read.csv(StringIO(data), header=True, inferSchema=True)
    df_clean = flight_preprocess(df)
    return df_clean

container_name = f"vehicles_{datetime.utcnow().strftime('%Y-%m-%d')}"
container_client = blob_service_client.get_container_client(container_name)
blob_list = container_client.list_blobs()

# Process CSV files in parallel and write the result to a Spark DataFrame
dfs = [main(blob) for blob in blob_list]
final_df = functools.reduce(lambda df1, df2: df1.union(df2), dfs)

final_df.toPandas().to_csv("/Users/haqn/vehicles_processed.csv", index=False)
spark.stop()
