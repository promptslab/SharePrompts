import React, { memo } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const styles = StyleSheet.create({
body: {
    paddingTop: '70px',
    paddingLeft: '70px',
    paddingRight: '50px',
    paddingBottom: 65,
    fontFamily: 'Times-Roman',
},
heading: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    margin: '10px'
},
title: {
    fontSize: 17,
    margin: '5px',
    marginLeft: '0',
    color: "#555",
    fontFamily: 'Times-Bold',
},

});

const refactorContent = (value: string) => {
    let output = value.replace(/<p>/gi, '');
    output = output.replace(/<\/p>/gi, '');
    return output
}

function GeneratePDF({content, title} : any) {
    return (
        <Document>
        <Page style={styles.body} wrap>
            <Text style={styles.heading}>{title}</Text>
            { content &&
                content.map((cnt: any, idx: number) => (
                    <View key={idx}>
                        <Text style={styles.title}>{cnt.from}</Text>
                        <Html>{refactorContent(cnt.value)}</Html>
                    </View>
                ))
            }
        </Page>
    </Document>
    )
}

export default memo(GeneratePDF);
