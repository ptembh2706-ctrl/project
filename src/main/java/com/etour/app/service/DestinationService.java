package com.etour.app.service;
import com.etour.app.dto.DestinationDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import javax.net.ssl.*;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.List;
@Service
public class DestinationService {

    private final RestTemplate restTemplate;

    // ⚠️ YOUR .NET API URL
    private static final String DOTNET_API_URL = "https://localhost:7183/api/Tours";

    public DestinationService() {
        trustAllCertificates();  // <-- THIS FIXES THE SSL ERROR
        this.restTemplate = new RestTemplate();
    }

    public List<DestinationDTO> getAllDestinations() {
        try {
            ResponseEntity<DestinationDTO[]> response = restTemplate.getForEntity(
                    DOTNET_API_URL,
                    DestinationDTO[].class
            );
            return Arrays.asList(response.getBody());
        } catch (Exception e) {
            System.err.println("Error calling .NET API: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch from .NET API", e);
        }
    }

    public DestinationDTO getDestinationByName(String name) {
        return restTemplate.getForObject(
                DOTNET_API_URL + "/" + name,
                DestinationDTO.class
        );
    }

    // ⚠️ TRUST ALL CERTIFICATES - DEV ONLY!
    private void trustAllCertificates() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[] {
                    new X509TrustManager() {
                        public X509Certificate[] getAcceptedIssuers() { return null; }
                        public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                        public void checkServerTrusted(X509Certificate[] certs, String authType) { }
                    }
            };

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}