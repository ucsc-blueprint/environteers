// should have Title, Date, Organization + org type(non profit), like count, comment count, start of description + "Read more" link
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';

export interface NewsUpdateProps {
    title: string;
    date: string;
    organization: string;
    organizationType: string;
    likeCount: number;
    commentCount: number;
    description: string;
    previewImage?: string;
    onReadMore: () => void;
}

export const NewsUpdate = ({
    title,
    date,
    organization,
    organizationType,
    likeCount,
    commentCount,
    description,
    previewImage,
    onReadMore,

    }: NewsUpdateProps) => {
    return(
        <View> 
            <View style = {{alignItems: 'center'}}>
            <Text style = {styles.title}>
                {organization}
            </Text>
            <Text style = {styles.text}>
                {organizationType} • {date}
            </Text>
            </View>
            <View>
                <Text style = {styles.title}>
                    {title}
                </Text>
                <Text style={styles.text}>
                    {description.length > 100
                        ? description.slice(0, 100) + '... '
                        : description + ' '}
                    <Text style={styles.readMore} onPress={onReadMore}>
                        Read more
                    </Text>
                </Text>

            </View>
            <View>
            {previewImage && (
            <Image
                source={{ uri: previewImage }}
                style={styles.image}
            />
        )}
            </View>
            <View>
                <Text>
                    Likes: {likeCount}   Comments: {commentCount}
                </Text>
            </View>
            
        </View>
        
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
    image:
    {
        width: 200,
        height: 200,
    },
    readMore:
    {
        color: 'blue',
        textDecorationLine: 'underline',
    },

})
