import React from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { Hourglass, Leaf, Calendar, ChevronRight, Pencil } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { Divider } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

export default function AdminAnalytics() {
  const { volunteerName, membershipStatus } = useLocalSearchParams();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ justifyContent: "center", alignItems: 'center' }}
      keyboardDismissMode="on-drag"
    >
      <View style={styles.profileContainer}>
        <View style={styles.profileCircle} />
        {/* default if no actual volunteer name */} 
        <Text style={styles.profileName}>{volunteerName || 'Volunteer Name'}</Text>
        <Text style={styles.membershipText}>{membershipStatus}</Text>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.button, styles.hoursButton]}>
          <View style={styles.iconsRow}>
            <Hourglass size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>117</Text>
          </View>
          <Text style={styles.buttonSubtext}>Hours tracked</Text>
        </View>
        
        <View style={[styles.button, styles.actionsButton]}>
          <View style={styles.iconsRow}>
            <Leaf size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>23</Text>
          </View>
          <Text style={styles.buttonSubtext}>Eco-Actions</Text>
        </View>
      </View>
      
      <View style={styles.bottomButton}>
        <View style={styles.buttonContent}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>View Eco-Action Details</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Volunteer History</Text>
        <View style={styles.graphWrapper}>
          <LineChart 
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: [1, 3, 2, 3, 6, 4, 5],
                  strokeWidth: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }
              ]
            }}
            width={358}
            height={250}
            withDots={true} 
            withShadow={false} 
            withInnerLines={false} 
            withOuterLines={false} 
            withVerticalLabels={false} 
            withHorizontalLabels={false}
            chartConfig={{
              backgroundColor: "#E0E0E0",
              backgroundGradientFrom: "#E0E0E0",
              backgroundGradientTo: "#E0E0E0",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: "#000000",
                fill: "#000000",
              }
            }}
            style={{
              borderRadius: 16,
            }}
          />
          <View style={styles.yAxis} />
          <View style={styles.xAxis} />
          <Text style={styles.yAxisTitle}>Eco-Actions</Text>
          <Text style={styles.xAxisTitle}>Year</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Recent Activity</Text>
        <View style={styles.activityWrapper}>
          <Text style={styles.activityHeader}>This week</Text>

          <View style={styles.activityRow}>
            <View style={styles.activityIconsWrapper}>
              <View style={styles.activityIconsRow}>
                <Leaf size={12} color="#000000" />
                <Text style={styles.activityText}>Eco-Action</Text>
              </View>
            </View>
            
            <View style={styles.activityMiddle}>
              <Text style={styles.activityText}>Signed up for...</Text>
            </View>

            <ChevronRight size={12} color="#000000" />
          </View>

          <Divider style={{ alignSelf: 'stretch', marginVertical: 12, backgroundColor: '#000000' }} />

          <View style={styles.activityRow}>
            <View style={styles.activityIconsWrapper}>
              <View style={styles.activityIconsRow}>
                <Calendar size={12} color="#000000" />
                <Text style={styles.activityText}>Event</Text>
              </View>
            </View>

            <View style={styles.activityMiddle}>
              <Text style={styles.activityText}>Attended...</Text>
            </View>

            <ChevronRight size={12} color="#000000" />
          </View>

          <Divider style={{ alignSelf: 'stretch', marginVertical: 12, backgroundColor: '#000000' }} />

          <View style={styles.activityRow}>
            <View style={styles.activityIconsWrapper}>
              <View style={styles.activityIconsRow}>
                <Leaf size={12} color="#000000" />
                <Text style={styles.activityText}>Eco-Action</Text>
              </View>
            </View>

            <View style={styles.activityMiddle}>
              <Text style={styles.activityText}>Signed up for...</Text>
            </View>

            <ChevronRight size={12} color="#000000" />
          </View>
        </View>
      </View>

      <View style={styles.notesContainer}>
        <View style={styles.notesHeader}>
          <Text style={styles.notesText}>Notes</Text>
          <Pencil size={16} color="#000000" />
        </View>

        <TextInput
          style={styles.addNotes}
          multiline
          textAlignVertical="top"
        />
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    width: 138,
    height: 141,
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
  },
  profileName: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  membershipText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
    color: '#666666',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    width: '100%',
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hoursButton: {
    width: 138,
    height: 135,
    backgroundColor: '#0282D3',
    marginRight: 20,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionsButton: {
    width: 138,
    height: 135,
    backgroundColor: '#79B128',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: 0,
    color: '#FFFFFF',
  },
  buttonSubtext: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomButton: {
    width: 358,
    height: 48,
    marginTop: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statusContainer: {
    width: 125,
    height: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  statusText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    color: '#000000',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailsText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
  },
  sectionContainer: {
    width: 358,
    marginTop: 24,
    alignItems: 'flex-start',
  },
  sectionHeader: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 19,
  },
  graphWrapper: {
    width: 358,
    marginTop: 24,
    alignItems: 'center',
  },
  yAxis: {
    position: 'absolute',
    left: 36,
    top: 16,
    bottom: 32,
    width: 2,
    backgroundColor: '#000',
  },
  xAxis: {
    position: 'absolute',
    left: 36,
    right: 16,
    bottom: 32,
    height: 2,
    backgroundColor: '#000',
  },
  yAxisTitle: {
    position: 'absolute',
    top: '50%',
    left: '-3%',
    transform: [
      { translateY: -10 },
      { rotate: '-90deg' },
    ],
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 10,
    color: '#000',
  },
  xAxisTitle: {
    position: 'absolute',
    top: '90%',
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 10,
  },
  activityWrapper: {
    width: 358,
    marginTop: 24,
    padding: 16,
    alignItems: 'flex-start',
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  activityHeader: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
    marginVertical: 6,
  },
  activityIconsWrapper: {
    width: 100,
  },
  activityIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 10,
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF'
  },
  activityMiddle: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  activityText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 13,
    color: '#000000',
  },
  notesContainer: {
    width: 358,
    margin: 24,
    alignItems: 'flex-start',
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    padding: 16,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  notesText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 19,
  },
  addNotes: {
    width: '100%',
    height: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
  },
} as const;