import { StyleSheet } from "react-native";

export const CardStyles = StyleSheet.create({
  feedHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },

  userText: {
    fontSize: 38,
    paddingVertical: 20,
    marginLeft: 9,
    fontStyle: 'italic',
    fontWeight: '300',
  },

  userName: {
    fontWeight: '700', 
    color: '#79B128',
    fontStyle: 'normal',
  },

  results: {
    fontSize: 11,
    alignSelf: 'center',
    fontWeight: '400',
    paddingVertical: 1,
    color: '#3E4657',
  },

  formatRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    minWidth: 0,
  },

  formatBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 3,
    paddingVertical: 20,
    alignItems: 'center',
    textAlign: 'center',
  },

  searchFilter: {
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: 400,
    fontSize: 12,
  },

  buttonFilter: {
    borderColor: '#0282D3',
    color: '#0282D3',
    borderWidth: 1.5,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: 400,
    fontSize: 10,
  },

  buttonPressed: {
    backgroundColor: '#0282D3',
  },

  searchBar: {
    color: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#ECF3F7',
  },

  card: {
    borderRadius: 24,
    padding: 16,
    gap: 15,
    backgroundColor: 'white',
    borderColor: '#96BDD7',
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    elevation: 3,
    // backgroundColor: 'white',
  },

  cardInfo: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  imageColumn: {
    width: 110,
  },

  contentColumn: {
    minWidth: 0,
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },

  iconsColumn: {
    width: 40,
    flexShrink: 0,
    alignItems: 'center',
    gap: 8,
  },
  
  title: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    flexShrink: 1,
    color: '#0282D3',
  },

  date: {
    fontSize: 12,
    marginBottom: 6,
    flex: 1,
    flexWrap: 'wrap',
    marginVertical: 5,
  },

  rsvp: {
    fontSize: 12,
    color: "#4F6629",
    fontWeight: '700',
  },
  
  rsvpContainer: {
    backgroundColor: '#E0FAE2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },

  location: {
    flexShrink: 1,
    minWidth: 0,
    textDecorationLine: 'underline',
  },

  iconBackgrounds: {
    backgroundColor: '#EAF2F6',
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },

  button: {
    borderWidth: 1,
    borderColor: '#0282D3',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },

  buttonText: {
    fontSize: 11,
    color: '#0282D3',
  },

  signUpContainer: {
    display: 'flex',
  },

  signUpButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  signUp: {
    backgroundColor: '#0282D3',
    color: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },

  signUpText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  signUpPrompt: {
    color: '#0282D3',
    fontSize: 12,
  },

  signUpButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  signUpButton: {
    backgroundColor: '#437CA1',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  signedUp: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },

  signUpPopup: {
    backgroundColor: '#EAF2F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },

  confirmationContainer: {
    flexDirection: 'column',
    backgroundColor: '#F6FBF2',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
    paddingVertical: 5,
    gap: 10,
  },

  confirmationButtons: {
    flexDirection: 'row',
    paddingVertical: 5,
    gap: 20,
  },

  confirmationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#3A5513',
    borderWidth: 1,
    padding: 5,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    borderRadius: 20,
    paddingVertical: 12,
    width: 150,
    justifyContent: 'center',
    gap: 5,

  },
  confirmationText: {
    fontSize: 15,
    color: '#3A5513',
  },

  deleteIconBackground:{
    backgroundColor: '#FFE3E1',
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  
  // Required Cards
  requiredCard: {
    backgroundColor: '#FFF4DF',
    borderColor: '#FF9212',
    borderWidth: 1,
  }
});