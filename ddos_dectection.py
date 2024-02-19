
from scapy.all import sniff, IP
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import pandas as pd
import random as rd
def capture_packets():
    filter_str = "tcp"
    packets = sniff(filter=filter_str, count=100)  
    return packets

def extract_features(packet):
    features = {}
    if IP in packet:
        features['src_ip'] = packet[IP].src
        features['dst_ip'] = packet[IP].dst
        features['ip_len'] = packet[IP].len
    return features

def preprocess_data(packets):
    data = [extract_features(packet) for packet in packets]
    return pd.DataFrame(data)

def train_model(X_train, y_train):
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    return model

def main():
    threshold = 0.5  
    while True:
        packets = capture_packets()
        df = preprocess_data(packets)
        labels = [1 if rd.random() < 0.1 else 0 for _ in range(len(df))]  # Assign 10% positive labels

        column_transformer = ColumnTransformer(
            [("ip_encoder", OneHotEncoder(), ['src_ip', 'dst_ip'])],
            remainder='passthrough'
        )
        pipeline = Pipeline([
            ("column_transformer", column_transformer),
        ])

        X = pipeline.fit_transform(df)

        X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

        model = train_model(X_train, y_train)
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        print(f"Model Accuracy: {accuracy}")
        threshold = 0.5  

        potential_attacks = [df.iloc[i] for i in range(len(predictions)) if predictions[i] > threshold]

        if potential_attacks:
            print("Potential DDoS attacks detected:")
            for attack in potential_attacks:
                print(f"Features: {attack}")
        else:
            print("No potential DDoS attacks detected.")

        print("-------------------------------")

if __name__ == "__main__":
    main()
