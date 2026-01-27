// should have Title, Date, Organization + org type(non profit), like count, comment count, start of description + "Read more" link

import { StyleSheet, Text, TouchableOpacity, View, Pressable, Image, Linking} from 'react-native';
import {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';

export interface NewsUpdateProps {
    title: string;
    date: string;
    organization: string;
    organizationType: string;
    likeCount: number;
    commentCount: number;
    description: string;
    link?: string;
    previewImage?: string;
    profilePicture?: string;
}

export const NewsUpdate = ({
    title,
    date,
    organization,
    organizationType,
    likeCount,
    commentCount,
    description,
    link,
    previewImage,
    profilePicture,

    }: NewsUpdateProps) => {
    const [isLiked, setIsLiked] = useState(false);
    return(
        <Pressable onPress ={() => {Linking.openURL(link || '')}}>
            <View style = {styles.card}> 
                <View style={styles.header}>
                    {profilePicture ? (
                        <Image style={styles.circularImage} source={{ uri: profilePicture }} />
                    ) : 
                    (
                        <View style={styles.circularImagePlaceholder} />
                    )}

                    <View style={styles.orgInfo}>
                        <Text style={styles.orgName}>{organization}</Text>
                        <Text style={styles.subText}>
                            {organizationType} • {date}
                        </Text>
                    </View>
                </View>
            <View>
                    <Text style = {styles.title}>
                        {title}
                    </Text>
                <View>
                    <Text style={styles.text} numberOfLines = {1} ellipsizeMode='tail'>
                        {description} + ' '
                    </Text>
                        <Text style={styles.readMore}>
                            Read more
                        </Text>
                </View>
            </View>
                <View>
                {previewImage ? 
                <Image
                    source={{ uri: previewImage }}
                    style={styles.image}
                />
                
                :
                <View style={styles.imagePlaceholder} />
                
            }
                </View>
                <View style = {{flexDirection : "row" }}>

                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    {/* Like button with count */}
                        <Pressable onPress = {() => setIsLiked(!isLiked)}>
                            <Ionicons name = {isLiked? "heart" : "heart-outline"} size={20} color= {isLiked? "red" : "gray"} />
                        </Pressable>
                        <Text> {likeCount + (isLiked ? 1 : 0)}</Text>
                    </View>
                    <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
                    {/* Comment icon with count */}
                        <Ionicons name = "chatbubble-ellipses-outline" size={20} color= "gray" />
                        <Text> {commentCount}</Text>
                    </View>
                </View>


            </View>
        </Pressable>
        
    )
}
const styles = StyleSheet.create({
    title:
    {
        fontSize: 18,
        fontWeight: 'bold',
        

    },
    text:
    {
        fontSize: 12,
    },
    subText:
    {
        fontSize: 10,
        color: 'gray',
    },
    card: 
    {
        width: '40%',
        backgroundColor: '#ceccccff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    image:
    {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginVertical: 8,
    },
    circularImage:
    {
    
        width: 40,
        height: 40,
        borderRadius: 50/2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "gray"
    },
    readMore:
    { 
        textDecorationLine: 'underline',
        fontSize: 12,
    },
    imagePlaceholder: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: '#e0e0e0',
    },
    circularImagePlaceholder: 
    {
        width: 40,
        height: 40,
        borderRadius: 50/2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "gray",
        backgroundColor: '#e0e0e0',
    },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    },

    orgInfo: {
        marginLeft: 8,
    },

    orgName: {
        fontSize: 14,
        fontWeight: 'bold',
    },

})
