import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.dashboardContainer}>
        <View style={styles.gridContainer}>
          <View style={[styles.gridBox, styles.gridBoxOdd]}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Active users</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>138</Text>
              <Text style={styles.trendUp}>↑</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>See all users</Text>
            </View>
          </View>
 
          <View style={styles.gridBox}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Events this month</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>64</Text>
              <Text style={styles.trendUp}>↑</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>See all events</Text>
            </View>
          </View>

          <View style={[styles.gridBox, styles.gridBoxOdd]}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Monthly online eco-actions</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>64</Text>
              <Text style={styles.trendDown}>↓</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>See all eco-actions</Text>
            </View>
          </View>

          <View style={styles.gridBox}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Monthly in-person eco-actions</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>64</Text>
              <Text style={styles.trendUp}>↑</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>See all eco-actions</Text>
            </View>
          </View>
          
          <View style={[styles.gridBox, styles.gridBoxOdd]}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Newsletter subscriptions</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>64</Text>
              <Text style={styles.trendUp}>↑</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>See newsletters</Text>
            </View>
          </View>

          <View style={styles.gridBox}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Newsletter reads</Text>
            </View>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>64</Text>
              <Text style={styles.trendUp}>↑</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>See newsletters</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dashboardContainer: {
    width: 315,
    height: 623,
    position: 'absolute' as const,
    top: 150,
    left: 40,
    gap: 20,
    opacity: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center' as const,
  },
  gridContainer: {
    width: 312,
    height: 392,
    opacity: 1,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'flex-start' as const,
    alignContent: 'flex-start' as const,
  },
  gridBox: {
    width: 148,
    height: 112,
    opacity: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  gridBoxOdd: {
    marginRight: 16,
  },
  titleContainer: {
    width: 127,
    height: 30,
    opacity: 1,
    gap: 4,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  titleText: {
    fontFamily: 'Mulish',
    fontWeight: '400' as const,
    fontStyle: 'normal' as const,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: 'center' as const,
    color: '#666',
  },
  numberContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginTop: 4,
  },
  numberText: {
    fontFamily: 'Mulish',
    fontWeight: '700' as const,
    fontStyle: 'normal' as const,
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: 0,
    color: '#172A36',
  },
  trendUp: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: 'bold' as const,
  },
  trendDown: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold' as const,
  },
  subtitleContainer: {
    width: 116.4,
    height: 15,
    opacity: 1,
    gap: 4,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 4,
  },
  subtitleText: {
    fontFamily: 'Mulish',
    fontWeight: '400' as const,
    fontStyle: 'normal' as const,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0,
    textAlign: 'center' as const,
    color: '#999',
  },
};
