#!/usr/bin/env python3
"""
Generate a realistic heart disease dataset based on Cleveland Heart Disease Database
Features match the UCI ML Repository format
"""

import pandas as pd
import numpy as np

# Set seed for reproducibility
np.random.seed(42)

# Number of samples
n_samples = 303

# Feature generation with realistic medical distributions
data = {
    # Age: 29-77, mean ~54
    'age': np.random.randint(29, 78, n_samples),

    # Sex: 1 = male, 0 = female (68% male in original dataset)
    'sex': np.random.choice([0, 1], n_samples, p=[0.32, 0.68]),

    # Chest pain type: 1-4 (typical angina, atypical angina, non-anginal pain, asymptomatic)
    'cp': np.random.choice([1, 2, 3, 4], n_samples, p=[0.25, 0.30, 0.25, 0.20]),

    # Resting blood pressure: 94-200 mmHg
    'trestbps': np.random.randint(94, 201, n_samples),

    # Serum cholesterol: 126-564 mg/dl
    'chol': np.random.randint(126, 565, n_samples),

    # Fasting blood sugar > 120 mg/dl: 1 = true, 0 = false (15% true)
    'fbs': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),

    # Resting ECG: 0 = normal, 1 = ST-T abnormality, 2 = left ventricular hypertrophy
    'restecg': np.random.choice([0, 1, 2], n_samples, p=[0.50, 0.45, 0.05]),

    # Maximum heart rate achieved: 71-202
    'thalach': np.random.randint(71, 203, n_samples),

    # Exercise induced angina: 1 = yes, 0 = no (33% yes)
    'exang': np.random.choice([0, 1], n_samples, p=[0.67, 0.33]),

    # ST depression induced by exercise: 0-6.2
    'oldpeak': np.round(np.random.uniform(0, 6.2, n_samples), 1),

    # Slope of peak exercise ST segment: 1 = upsloping, 2 = flat, 3 = downsloping
    'slope': np.random.choice([1, 2, 3], n_samples, p=[0.45, 0.40, 0.15]),

    # Number of major vessels colored by fluoroscopy: 0-3
    'ca': np.random.choice([0, 1, 2, 3], n_samples, p=[0.55, 0.20, 0.15, 0.10]),

    # Thalassemia: 3 = normal, 6 = fixed defect, 7 = reversible defect
    'thal': np.random.choice([3, 6, 7], n_samples, p=[0.50, 0.15, 0.35])
}

# Create DataFrame
df = pd.DataFrame(data)

# Generate target with correlations to features
# Higher risk factors increase probability of heart disease
risk_score = (
    (df['age'] > 55).astype(int) * 0.3 +
    (df['sex'] == 1).astype(int) * 0.2 +  # Males higher risk
    (df['cp'] == 4).astype(int) * 0.4 +   # Asymptomatic chest pain
    (df['trestbps'] > 140).astype(int) * 0.2 +
    (df['chol'] > 240).astype(int) * 0.3 +
    (df['fbs'] == 1).astype(int) * 0.1 +
    (df['thalach'] < 120).astype(int) * 0.3 +
    (df['exang'] == 1).astype(int) * 0.4 +
    (df['oldpeak'] > 2).astype(int) * 0.3 +
    (df['ca'] > 0).astype(int) * 0.4 +
    (df['thal'] == 7).astype(int) * 0.3
)

# Convert risk score to probability
prob = 1 / (1 + np.exp(-2 * (risk_score - 1.5)))

# Generate target: 0 = no disease, 1 = disease present
df['target'] = (np.random.random(n_samples) < prob).astype(int)

# Save to CSV
df.to_csv('data/heart.csv', index=False)

print(f"Dataset created successfully!")
print(f"Shape: {df.shape}")
print(f"\nTarget distribution:")
print(df['target'].value_counts())
print(f"\nFirst few rows:")
print(df.head())
print(f"\nDataset statistics:")
print(df.describe())
