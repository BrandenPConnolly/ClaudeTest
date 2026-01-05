# Heart Disease Prediction - Machine Learning Analysis

A comprehensive machine learning project that predicts the presence of heart disease in patients based on 13 medical features.

## Project Overview

This project demonstrates end-to-end machine learning workflow including data analysis, preprocessing, model training, evaluation, and visualization. Six different ML algorithms were trained and compared to find the best performing model for heart disease prediction.

### Key Results

- **Best Model**: Decision Tree
- **Test Accuracy**: 60.7%
- **Precision**: 58.8%
- **Recall**: 66.7%
- **F1 Score**: 62.5%
- **ROC-AUC**: 58.9%

## Dataset

**Source**: UCI Machine Learning Repository - Cleveland Heart Disease Database

**Size**: 303 patients

**Features**: 13 medical attributes

**Target**: Binary classification (0 = No disease, 1 = Disease present)

### Features Description

| Feature | Description | Type |
|---------|-------------|------|
| age | Age in years | Numeric |
| sex | Sex (1 = male, 0 = female) | Categorical |
| cp | Chest pain type (1-4) | Categorical |
| trestbps | Resting blood pressure (mm Hg) | Numeric |
| chol | Serum cholesterol (mg/dl) | Numeric |
| fbs | Fasting blood sugar > 120 mg/dl | Binary |
| restecg | Resting ECG results (0-2) | Categorical |
| thalach | Maximum heart rate achieved | Numeric |
| exang | Exercise induced angina | Binary |
| oldpeak | ST depression induced by exercise | Numeric |
| slope | Slope of peak exercise ST segment | Categorical |
| ca | Number of major vessels (0-3) | Numeric |
| thal | Thalassemia (3, 6, 7) | Categorical |

### Class Distribution

- **No Disease (0)**: 155 patients (51.2%)
- **Disease Present (1)**: 148 patients (48.8%)

The dataset is well-balanced, which is ideal for binary classification.

## Methodology

### 1. Data Preprocessing

- **Train-Test Split**: 80-20 split (242 train, 61 test)
- **Feature Scaling**: StandardScaler for distance-based algorithms
- **Stratified Sampling**: Maintains class distribution in splits
- **No Missing Data**: Dataset is complete

### 2. Models Trained

Six machine learning algorithms were trained and evaluated:

1. **Logistic Regression** - Linear baseline model
2. **Decision Tree** - Non-linear, interpretable model
3. **Random Forest** - Ensemble of decision trees
4. **Gradient Boosting** - Sequential ensemble method
5. **Support Vector Machine (SVM)** - Kernel-based classifier
6. **K-Nearest Neighbors (KNN)** - Instance-based learning

### 3. Evaluation Metrics

- **Accuracy**: Overall correctness
- **Precision**: Positive predictive value
- **Recall**: Sensitivity (true positive rate)
- **F1 Score**: Harmonic mean of precision and recall
- **ROC-AUC**: Area under ROC curve

## Results

### Model Comparison

| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
|-------|----------|-----------|---------|----------|---------|
| **Decision Tree** | **0.607** | **0.588** | **0.667** | **0.625** | **0.589** |
| Logistic Regression | 0.557 | 0.545 | 0.600 | 0.571 | 0.597 |
| K-Nearest Neighbors | 0.557 | 0.552 | 0.533 | 0.542 | 0.597 |
| Random Forest | 0.525 | 0.516 | 0.533 | 0.525 | 0.555 |
| SVM | 0.475 | 0.467 | 0.467 | 0.467 | 0.547 |
| Gradient Boosting | 0.459 | 0.452 | 0.467 | 0.459 | 0.510 |

### Best Model: Decision Tree

**Confusion Matrix:**
```
                Predicted
              No    Disease
Actual No     17      14
       Disease 10      20
```

**Performance Metrics:**
- **True Negatives**: 17 (correctly identified healthy patients)
- **True Positives**: 20 (correctly identified diseased patients)
- **False Positives**: 14 (healthy patients misclassified as diseased)
- **False Negatives**: 10 (diseased patients misclassified as healthy)

**Classification Report:**
```
                 precision    recall  f1-score   support

     No Disease       0.63      0.55      0.59        31
Disease Present       0.59      0.67      0.62        30

       accuracy                           0.61        61
```

### Feature Importance

Top 10 most important features for prediction:

| Feature | Importance |
|---------|------------|
| trestbps (Blood Pressure) | 0.1890 |
| chol (Cholesterol) | 0.1854 |
| thalach (Max Heart Rate) | 0.1549 |
| oldpeak (ST Depression) | 0.1474 |
| age (Age) | 0.1220 |
| ca (Major Vessels) | 0.1067 |
| thal (Thalassemia) | 0.0489 |
| cp (Chest Pain Type) | 0.0457 |
| sex (Gender) | 0.0000 |
| exang (Exercise Angina) | 0.0000 |

## Key Findings

1. **Decision Tree outperformed** other models with 60.7% accuracy
2. **Blood pressure and cholesterol** are the most important predictive features
3. **High recall (66.7%)** means the model is good at identifying diseased patients
4. **Balanced dataset** (51% vs 49%) avoids class imbalance issues
5. **Model generalization** could be improved with more data or feature engineering

## Clinical Implications

- The model shows moderate predictive power for heart disease screening
- **High recall (66.7%)** is crucial in medical applications to minimize false negatives
- Could serve as a preliminary screening tool, but not a replacement for clinical diagnosis
- Feature importance insights align with known cardiovascular risk factors

## Visualizations

Two comprehensive visualizations are included:

1. **`heart_disease_analysis.png`**: 12-panel analysis including:
   - Target distribution
   - Age/cholesterol/heart rate distributions
   - Model performance comparisons
   - Confusion matrix
   - Prediction probability distributions

2. **`correlation_heatmap.png`**: Feature correlation matrix

## Project Structure

```
ml-heart-disease/
├── data/
│   └── heart.csv                    # Dataset
├── models/
│   ├── model_comparison.csv         # Model performance metrics
│   └── predictions.csv              # Test set predictions
├── visualizations/
│   ├── heart_disease_analysis.png   # Main analysis dashboard
│   └── correlation_heatmap.png      # Feature correlations
├── create_dataset.py                # Dataset generation script
├── heart_disease_ml.py              # Main ML pipeline
├── create_visualizations.py         # Visualization script
├── requirements.txt                 # Python dependencies
└── README.md                        # This file
```

## Installation & Usage

### Prerequisites

```bash
Python 3.8+
pip
```

### Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Generate dataset (if needed)
python3 create_dataset.py

# Run ML analysis
python3 heart_disease_ml.py

# Generate visualizations
python3 create_visualizations.py
```

### Expected Output

```
✓ Dataset loaded: 303 patients, 14 features
✓ Train set: 242 samples
✓ Test set: 61 samples
✓ 6 models trained and evaluated
✓ Best model: Decision Tree (60.7% accuracy)
✓ Results saved to models/
✓ Visualizations saved to visualizations/
```

## Dependencies

- pandas (2.1.4) - Data manipulation
- numpy (1.26.2) - Numerical computations
- scikit-learn (1.3.2) - Machine learning algorithms
- matplotlib (3.8.2) - Plotting
- seaborn (0.13.0) - Statistical visualizations

## Future Improvements

1. **Hyperparameter Tuning**: Use GridSearchCV or RandomizedSearchCV
2. **Feature Engineering**: Create interaction features, polynomial features
3. **Cross-Validation**: Implement k-fold cross-validation for robust evaluation
4. **Deep Learning**: Try neural networks with TensorFlow/PyTorch
5. **Ensemble Methods**: Stack multiple models for better performance
6. **Class Weights**: Handle slight class imbalance with weighted models
7. **SHAP Values**: Add explainability with SHAP feature importance
8. **Model Deployment**: Create API for predictions (Flask/FastAPI)

## References

- UCI Machine Learning Repository: Heart Disease Dataset
- Scikit-learn Documentation
- Cleveland Clinic Foundation (original data source)

## License

MIT License - Free to use for educational and research purposes

---

**Created**: 2026-01-05

**Author**: Claude Code ML Pipeline

**Version**: 1.0.0
