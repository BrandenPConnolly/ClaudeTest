#!/usr/bin/env python3
"""
Heart Disease Prediction - Complete ML Pipeline
Predicts presence of heart disease using patient medical data
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score, roc_curve
)
import warnings
warnings.filterwarnings('ignore')

# Set style
sns.set_style('whitegrid')
plt.rcParams['figure.figsize'] = (12, 8)

print("="*70)
print("HEART DISEASE PREDICTION - ML ANALYSIS")
print("="*70)

# 1. LOAD DATA
print("\n[1] Loading dataset...")
df = pd.read_csv('data/heart.csv')
print(f"✓ Dataset loaded: {df.shape[0]} patients, {df.shape[1]} features")

# 2. EXPLORATORY DATA ANALYSIS
print("\n[2] Exploratory Data Analysis")
print("-" * 70)

print("\nDataset Info:")
print(df.info())

print("\nTarget Distribution:")
print(df['target'].value_counts())
print(f"\nClass balance: {df['target'].value_counts(normalize=True).round(3).to_dict()}")

print("\nMissing values:")
print(df.isnull().sum())

print("\nFeature Statistics:")
print(df.describe())

# Feature names
feature_names = {
    'age': 'Age (years)',
    'sex': 'Sex (1=male, 0=female)',
    'cp': 'Chest Pain Type',
    'trestbps': 'Resting Blood Pressure',
    'chol': 'Cholesterol (mg/dl)',
    'fbs': 'Fasting Blood Sugar > 120',
    'restecg': 'Resting ECG',
    'thalach': 'Max Heart Rate',
    'exang': 'Exercise Induced Angina',
    'oldpeak': 'ST Depression',
    'slope': 'Slope of Peak Exercise ST',
    'ca': 'Major Vessels (0-3)',
    'thal': 'Thalassemia'
}

# 3. DATA PREPROCESSING
print("\n[3] Data Preprocessing")
print("-" * 70)

# Separate features and target
X = df.drop('target', axis=1)
y = df['target']

# Train-test split (80-20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"✓ Train set: {X_train.shape[0]} samples")
print(f"✓ Test set: {X_test.shape[0]} samples")

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print(f"✓ Features scaled (StandardScaler)")

# 4. MODEL TRAINING
print("\n[4] Training Multiple Models")
print("-" * 70)

models = {
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
    'Decision Tree': DecisionTreeClassifier(random_state=42, max_depth=5),
    'Random Forest': RandomForestClassifier(random_state=42, n_estimators=100),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42, n_estimators=100),
    'SVM': SVC(random_state=42, probability=True),
    'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=5)
}

results = {}

for name, model in models.items():
    print(f"\nTraining {name}...")

    # Train
    if name in ['Logistic Regression', 'SVM', 'K-Nearest Neighbors']:
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]

    # Evaluate
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)

    results[name] = {
        'model': model,
        'predictions': y_pred,
        'probabilities': y_pred_proba,
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'roc_auc': roc_auc
    }

    print(f"  Accuracy:  {accuracy:.3f}")
    print(f"  Precision: {precision:.3f}")
    print(f"  Recall:    {recall:.3f}")
    print(f"  F1 Score:  {f1:.3f}")
    print(f"  ROC-AUC:   {roc_auc:.3f}")

# 5. MODEL COMPARISON
print("\n[5] Model Comparison")
print("-" * 70)

comparison_df = pd.DataFrame({
    'Model': list(results.keys()),
    'Accuracy': [r['accuracy'] for r in results.values()],
    'Precision': [r['precision'] for r in results.values()],
    'Recall': [r['recall'] for r in results.values()],
    'F1 Score': [r['f1'] for r in results.values()],
    'ROC-AUC': [r['roc_auc'] for r in results.values()]
}).sort_values('Accuracy', ascending=False)

print("\n" + comparison_df.to_string(index=False))

best_model_name = comparison_df.iloc[0]['Model']
best_model = results[best_model_name]['model']
print(f"\n🏆 Best Model: {best_model_name}")
print(f"   Accuracy: {comparison_df.iloc[0]['Accuracy']:.3f}")

# 6. DETAILED EVALUATION OF BEST MODEL
print(f"\n[6] Detailed Evaluation - {best_model_name}")
print("-" * 70)

y_pred_best = results[best_model_name]['predictions']

print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred_best)
print(cm)
print(f"\nTrue Negatives:  {cm[0,0]}")
print(f"False Positives: {cm[0,1]}")
print(f"False Negatives: {cm[1,0]}")
print(f"True Positives:  {cm[1,1]}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred_best,
                          target_names=['No Disease', 'Disease Present']))

# 7. FEATURE IMPORTANCE (for tree-based models)
print("\n[7] Feature Importance Analysis")
print("-" * 70)

if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nTop 10 Most Important Features:")
    for idx, row in feature_importance.head(10).iterrows():
        print(f"  {row['feature']:12s}: {row['importance']:.4f}")
else:
    print("\nFeature importance not available for this model type.")
    if best_model_name == 'Logistic Regression':
        coef_df = pd.DataFrame({
            'feature': X.columns,
            'coefficient': best_model.coef_[0]
        }).sort_values('coefficient', key=abs, ascending=False)
        print("\nTop Features by Coefficient Magnitude:")
        for idx, row in coef_df.head(10).iterrows():
            print(f"  {row['feature']:12s}: {row['coefficient']:+.4f}")

# 8. SAVE RESULTS
print("\n[8] Saving Results")
print("-" * 70)

comparison_df.to_csv('models/model_comparison.csv', index=False)
print("✓ Model comparison saved to models/model_comparison.csv")

# Save best model predictions
predictions_df = pd.DataFrame({
    'actual': y_test,
    'predicted': y_pred_best,
    'probability': results[best_model_name]['probabilities']
})
predictions_df.to_csv('models/predictions.csv', index=False)
print("✓ Predictions saved to models/predictions.csv")

print("\n" + "="*70)
print("ANALYSIS COMPLETE!")
print("="*70)
print(f"\nKey Findings:")
print(f"• Best performing model: {best_model_name}")
print(f"• Test accuracy: {comparison_df.iloc[0]['Accuracy']:.1%}")
print(f"• Model can predict heart disease with {comparison_df.iloc[0]['Accuracy']:.1%} accuracy")
print(f"• Dataset: {df.shape[0]} patients with {df.shape[1]-1} medical features")
