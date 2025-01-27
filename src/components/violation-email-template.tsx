interface EmailTemplateProps {
    plate: string,
    address: string,
    timestamp: string
}

export function ViolationEmailTemplate(props: EmailTemplateProps): string {
    const { plate, address, timestamp } = props

    return (`
        <Html>
            <head></head>
            <Preview>Violation reported at ${address}</Preview>
            <Body style="${main}">
                <Container style="${container}">
                    <Heading style="font-size: 36px; line-height: 1.3; color: #747474; font-weight: 700; text-align: center;">
                        Violation at: ${address}
                    </Heading>
                    <Hr />
                    <Text style="font-size: 22px; padding: 20px; line-height: 1.3; color: #808080;">
                        Plate: ${plate}
                    </Text>
                    <Text style="font-size: 22px; padding: 20px; line-height: 1.3; color: #808080;">
                        Date: ${timestamp}
                    </Text>
                </Container>
            </Body>
        </Html>
    `)
}

const main = `
    background-color: #ffffff;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
`;

const container = `
    margin: 10px auto;
    width: 600px;
    max-width: 100%;
    border: 1px solid #E5E5E5;
`;
