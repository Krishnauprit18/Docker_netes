
from scapy.all import sniff, IP
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
import pandas as pd

def capture_packets():
    # Define a filter to capture only TCP packets
    filter_str = "tcp"
    packets = sniff(filter=filter_str, count=100)  # Capture 100 packets, adjust count as needed
    return packets

def extract_features(packet):
    # Extract relevant features from the packet
    features = {}
    if IP in packet:
        features['src_ip'] = packet[IP].src
        features['dst_ip'] = packet[IP].dst
        features['ip_len'] = packet[IP].len
    return features

def preprocess_data(packets):
    # Preprocess the data by extracting features from each packet
    data = [extract_features(packet) for packet in packets]
    return pd.DataFrame(data)

def train_model(X_train, y_train):
    # Train a simple Random Forest classifier
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    return model

def main():
    threshold = 0.5  # Adjust threshold as needed
    while True:
        # Capture packets
        packets = capture_packets()

        # Preprocess the data
        df = preprocess_data(packets)

        # Dummy labels for demonstration purposes; you'd need labeled data for training
        labels = [0] * len(df)

        # Convert IP addresses to numerical features using one-hot encoding
        column_transformer = ColumnTransformer(
            [("ip_encoder", OneHotEncoder(), ['src_ip', 'dst_ip'])],
            remainder='passthrough'
        )
        pipeline = Pipeline([
            ("column_transformer", column_transformer),
        ])

        X = pipeline.fit_transform(df)

        # Split the data for training (80%) and testing (20%)
        X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

        # Train the model
        model = train_model(X_train, y_train)

        # Make predictions on the test set
        predictions = model.predict(X_test)

        # Evaluate the model
        accuracy = accuracy_score(y_test, predictions)
        print(f"Model Accuracy: {accuracy}")

        # Check for potential DDoS attacks based on the model predictions
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