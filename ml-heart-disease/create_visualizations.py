#!/usr/bin/env python3
"""
Create visualizations for heart disease prediction analysis
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_curve
import warnings
warnings.filterwarnings('ignore')

# Set style
sns.set_style('whitegrid')
sns.set_palette('husl')

print("Creating visualizations...")

# Load data
df = pd.read_csv('data/heart.csv')
model_comparison = pd.read_csv('models/model_comparison.csv')
predictions = pd.read_csv('models/predictions.csv')

# Create figure with subplots
fig = plt.figure(figsize=(20, 12))

# 1. Target Distribution
ax1 = plt.subplot(3, 4, 1)
df['target'].value_counts().plot(kind='bar', ax=ax1, color=['#2ecc71', '#e74c3c'])
ax1.set_title('Heart Disease Distribution', fontsize=12, fontweight='bold')
ax1.set_xlabel('Diagnosis (0=No Disease, 1=Disease)')
ax1.set_ylabel('Number of Patients')
ax1.set_xticklabels(['No Disease', 'Disease'], rotation=0)
for i, v in enumerate(df['target'].value_counts()):
    ax1.text(i, v + 5, str(v), ha='center', fontweight='bold')

# 2. Age Distribution by Target
ax2 = plt.subplot(3, 4, 2)
df.boxplot(column='age', by='target', ax=ax2)
ax2.set_title('Age Distribution by Disease Status', fontsize=12, fontweight='bold')
ax2.set_xlabel('Heart Disease (0=No, 1=Yes)')
ax2.set_ylabel('Age (years)')
plt.suptitle('')  # Remove auto title

# 3. Sex vs Heart Disease
ax3 = plt.subplot(3, 4, 3)
pd.crosstab(df['sex'], df['target']).plot(kind='bar', ax=ax3)
ax3.set_title('Gender vs Heart Disease', fontsize=12, fontweight='bold')
ax3.set_xlabel('Sex (0=Female, 1=Male)')
ax3.set_ylabel('Count')
ax3.legend(['No Disease', 'Disease'])
ax3.set_xticklabels(['Female', 'Male'], rotation=0)

# 4. Chest Pain Type
ax4 = plt.subplot(3, 4, 4)
pd.crosstab(df['cp'], df['target']).plot(kind='bar', ax=ax4)
ax4.set_title('Chest Pain Type vs Heart Disease', fontsize=12, fontweight='bold')
ax4.set_xlabel('Chest Pain Type')
ax4.set_ylabel('Count')
ax4.legend(['No Disease', 'Disease'])

# 5. Model Comparison - Accuracy
ax5 = plt.subplot(3, 4, 5)
model_comparison.sort_values('Accuracy', ascending=True).plot(
    x='Model', y='Accuracy', kind='barh', ax=ax5, legend=False, color='#3498db'
)
ax5.set_title('Model Accuracy Comparison', fontsize=12, fontweight='bold')
ax5.set_xlabel('Accuracy')
ax5.set_ylabel('')
ax5.axvline(x=0.6, color='red', linestyle='--', alpha=0.5)

# 6. Model Metrics Comparison
ax6 = plt.subplot(3, 4, 6)
metrics_df = model_comparison.set_index('Model')[['Accuracy', 'Precision', 'Recall', 'F1 Score']]
metrics_df.plot(kind='bar', ax=ax6)
ax6.set_title('All Metrics Comparison', fontsize=12, fontweight='bold')
ax6.set_xlabel('')
ax6.set_ylabel('Score')
ax6.legend(loc='lower right', fontsize=8)
ax6.set_xticklabels(ax6.get_xticklabels(), rotation=45, ha='right')

# 7. ROC-AUC Scores
ax7 = plt.subplot(3, 4, 7)
model_comparison.sort_values('ROC-AUC', ascending=True).plot(
    x='Model', y='ROC-AUC', kind='barh', ax=ax7, legend=False, color='#9b59b6'
)
ax7.set_title('ROC-AUC Score Comparison', fontsize=12, fontweight='bold')
ax7.set_xlabel('ROC-AUC Score')
ax7.set_ylabel('')

# 8. Confusion Matrix Heatmap
ax8 = plt.subplot(3, 4, 8)
cm = confusion_matrix(predictions['actual'], predictions['predicted'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax8, cbar=False)
ax8.set_title('Confusion Matrix (Best Model)', fontsize=12, fontweight='bold')
ax8.set_xlabel('Predicted')
ax8.set_ylabel('Actual')
ax8.set_xticklabels(['No Disease', 'Disease'])
ax8.set_yticklabels(['No Disease', 'Disease'])

# 9. Cholesterol Distribution
ax9 = plt.subplot(3, 4, 9)
df.boxplot(column='chol', by='target', ax=ax9)
ax9.set_title('Cholesterol by Disease Status', fontsize=12, fontweight='bold')
ax9.set_xlabel('Heart Disease')
ax9.set_ylabel('Cholesterol (mg/dl)')
plt.suptitle('')

# 10. Max Heart Rate
ax10 = plt.subplot(3, 4, 10)
df.boxplot(column='thalach', by='target', ax=ax10)
ax10.set_title('Max Heart Rate by Disease Status', fontsize=12, fontweight='bold')
ax10.set_xlabel('Heart Disease')
ax10.set_ylabel('Max Heart Rate (bpm)')
plt.suptitle('')

# 11. Blood Pressure
ax11 = plt.subplot(3, 4, 11)
df.boxplot(column='trestbps', by='target', ax=ax11)
ax11.set_title('Blood Pressure by Disease Status', fontsize=12, fontweight='bold')
ax11.set_xlabel('Heart Disease')
ax11.set_ylabel('Resting BP (mm Hg)')
plt.suptitle('')

# 12. Prediction Probability Distribution
ax12 = plt.subplot(3, 4, 12)
predictions[predictions['actual'] == 0]['probability'].hist(
    bins=20, alpha=0.5, label='No Disease', ax=ax12, color='green'
)
predictions[predictions['actual'] == 1]['probability'].hist(
    bins=20, alpha=0.5, label='Disease', ax=ax12, color='red'
)
ax12.set_title('Prediction Probability Distribution', fontsize=12, fontweight='bold')
ax12.set_xlabel('Predicted Probability of Disease')
ax12.set_ylabel('Frequency')
ax12.legend()
ax12.axvline(x=0.5, color='black', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig('visualizations/heart_disease_analysis.png', dpi=300, bbox_inches='tight')
print("✓ Main visualization saved: visualizations/heart_disease_analysis.png")

# Create correlation heatmap
plt.figure(figsize=(12, 10))
correlation = df.corr()
mask = np.triu(np.ones_like(correlation), k=1)
sns.heatmap(correlation, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, square=True, linewidths=1, mask=mask,
            cbar_kws={"shrink": 0.8})
plt.title('Feature Correlation Heatmap', fontsize=16, fontweight='bold', pad=20)
plt.tight_layout()
plt.savefig('visualizations/correlation_heatmap.png', dpi=300, bbox_inches='tight')
print("✓ Correlation heatmap saved: visualizations/correlation_heatmap.png")

print("\n✓ All visualizations created successfully!")
