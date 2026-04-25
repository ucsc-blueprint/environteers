import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { supabase } from '@/constants/supabase';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";

// supabase query
// total number of users (rows) from users table
// all completion timestamps from interactions_eco_online
// all completion timestamps from interactions_eco_inperson
// all completion timestamps from interactions_events
// total number of clicks (rows) from interaction_news


export default function AdminDashboard() {
  const router = useRouter();

  // stores start date and end date for filtering
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // show date picker
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");
  const [showPicker, setShowPicker] = useState(false);

  const changeDate = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setShowPicker(false);

    if (!selectedDate) return;

    if (pickerMode === "start") {
      setStartDate(selectedDate);

      if (endDate && selectedDate > endDate) {
        setEndDate(null);
      }
    }

    if (pickerMode === "end") {
      setEndDate(selectedDate);
    }
  }

  const [dashboardTimestamps, setDashboardTimestamps] = useState({
    users: [] as Date[],
    news: [] as Date[],
    onlineEcoActions: [] as Date[],
    inPersonEcoActions: [] as Date[],
    events: [] as Date[],
    // add newsletter subscriptions later
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardTimestamps = async () => {
    setLoading(true);

    const [
      usersRes,
      onlineRes,
      inPersonRes,
      eventsRes,
      newsRes,
    ] = await Promise.all([
      supabase
        .from("users")
        .select("created_at"),

      supabase
        .from("interactions_eco_online")
        .select("completed_timestamp"),

      supabase
        .from("interactions_eco_inperson")
        .select("completed_timestamp"),

      supabase
        .from("interactions_events")
        .select("completed_timestamp"),

      supabase
        .from("interaction_news")
        .select("created_at"),
    ]);

    if (
      usersRes.error ||
      onlineRes.error ||
      inPersonRes.error ||
      eventsRes.error ||
      newsRes.error
    ) {
      console.error("Dashboard fetch error:", {
        usersRes,
        onlineRes,
        inPersonRes,
        eventsRes,
        newsRes,
      });
      setLoading(false);
      return null;
    }

    const dashboardTimestamps = {
      users: (usersRes.data ?? []).map(
        (d) => new Date(d.created_at)
      ),

      news: (newsRes.data ?? []).map(
        (d) => new Date(d.created_at)
      ),

      onlineEcoActions: (onlineRes.data ?? []).map(
        (d) => new Date(d.completed_timestamp)
      ),

      inPersonEcoActions: (inPersonRes.data ?? []).map(
        (d) => new Date(d.completed_timestamp)
      ),

      events: (eventsRes.data ?? []).map(
        (d) => new Date(d.completed_timestamp)
      ),
    };

    setLoading(false);
    return dashboardTimestamps;
  };

  useEffect(() => {
    const load = async () => {
      const data = await fetchDashboardTimestamps();
      if (data) setDashboardTimestamps(data);
    };

    load();
  }, []);

if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={{ flexGrow: 1 }}
  >
    
      <View style={styles.dateColumnContainer}>

        <View style={styles.dateColumn}>
          <Text style={styles.dateHeader}>Start Date
            <Text style={{color: "#ef4444"}}>*</Text>
          </Text>

          <Pressable
            style={styles.dateBoxFull}
            onPress={() => {
              setPickerMode("start");
              setShowPicker(true);
            }}
          >
            <Text style={startDate ? styles.dateText : styles.emptyDateText}>
              {startDate ? startDate.toLocaleDateString() : "Set date"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.dateColumn}>
          <Text style={styles.dateHeader}>End Date
            <Text style={{color: "#ef4444"}}>*</Text>
          </Text>

          <Pressable
            style={styles.dateBoxFull}
            onPress={() => {
              setPickerMode("end");
              setShowPicker(true);
            }}
          >
            <Text style={endDate ? styles.dateText : styles.emptyDateText}>
              {endDate ? endDate.toLocaleDateString() : "Set date"}
            </Text>
          </Pressable>
        </View>

      </View>

      {showPicker && (
        <DateTimePicker
          style={{alignSelf: 'center'}}
          value={
            pickerMode === "start"
              ? startDate || new Date()
              : endDate || new Date()
          }
          textColor="black"
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={changeDate}
        />
      )}
    <View style={styles.dashboardContainer}>
      <View style={styles.gridContainer}>

        {/* Active Users */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Active users</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>{dashboardTimestamps.users.length}</Text>
          </View>

          <Pressable
            style={styles.subtitleContainer}
            onPress={() => router.push('/(tabs)/VolunteerView')}
          >
            <Text style={styles.subtitleText}>View</Text>
            <ChevronRight color="#0282D3"/>
          </Pressable>
        </View>

        {/* Events */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Events this month</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>
              {dashboardTimestamps.events.length}
            </Text>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See all events</Text>
            <ChevronRight color="#0282D3"/>
          </View>
        </View>

        {/* Online Eco-Actions */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Online eco-actions</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>
              {dashboardTimestamps.onlineEcoActions.length}
            </Text>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See all eco-actions</Text>
            <ChevronRight color="#0282D3"/>
          </View>
        </View>

        {/* In-Person Eco-Actions */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>In-person eco-actions</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>
              {dashboardTimestamps.inPersonEcoActions.length}
            </Text>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See all eco-actions</Text>
            <ChevronRight color="#0282D3"/>
          </View>
        </View>

        {/* Newsletter Subscriptions */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Subscriptions</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>
              64
            </Text>
          </View>

          <Pressable style={styles.subtitleContainer}
            onPress={() => router.push('/(tabs)/newsletter')}>
            <Text style={styles.subtitleText}>See newsletters</Text>
            <ChevronRight color="#0282D3" style={{margin: 0}}/>
          </Pressable>
        </View>

        {/* Newsletter Reads */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Newsletter reads</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>
              {dashboardTimestamps.news.length}
            </Text>
          </View>

          <Pressable style={styles.subtitleContainer}
            onPress={() => router.push('/(tabs)/newsletter')}>
            <Text style={styles.subtitleText}>See newsletters</Text>
            <ChevronRight color="#0282D3"/>
          </Pressable>
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
    flex: 1,
    marginTop: 20,
    backgroundColor: '#EAF2F6',
    padding: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  gridContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
  },

  gridBox: {
    width: '48%',
    height: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center', 
    marginBottom: 16,
    gap: 12,
    borderColor: '#D5D5D5',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  titleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center', 
  },

  titleText: {
    fontFamily: 'Mulish',
    fontWeight: '300',
    fontSize: 12,
    textAlign: 'center', 
    color: '#000000',
  },

  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    marginTop: 4,
  },

  numberText: {
    fontFamily: 'Mulish',
    fontWeight: '500' as const,
    fontSize: 24,
    color: '#172A36',
  },

  subtitleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 4,
    flexDirection: "row",
  },

  subtitleText: {
    fontFamily: 'Mulish',
    fontWeight: '300',
    fontSize: 12,
    textAlign: 'center', 
    color: '#0282D3',
  },

  dateHeader: {
    fontFamily: 'Mulish',
    fontSize: 15,
    fontWeight: 500,
    color: '#6C6C6C',
    textAlign: "left",
    marginBottom: 6,
  },

  emptyDateText: {
    fontFamily: 'Mulish',
    fontSize: 12,
    color: '#D9E0DE',
  },

  dateText: {
    fontFamily: 'Mulish',
    fontSize: 12,
    color: '#333',
  },

  dateColumnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 16,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },

  dateColumn: {
    width: "48%",
  },

  dateBoxFull: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D9E0DE",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

} as const;
