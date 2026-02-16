import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Asansör Takip Sistemi</Text>
        <Text style={styles.subtitle}>Mobil Teknisyen Uygulaması</Text>
      </View>

      <View style={styles.features}>
        <FeatureCard 
          icon="📷" 
          title="QR Kod Okut" 
          description="Asansörü hızlıca tanı"
        />
        <FeatureCard 
          icon="✓" 
          title="Bakım Formu" 
          description="46 maddelik kontrol listesi"
        />
        <FeatureCard 
          icon="✍️" 
          title="İmza Al" 
          description="Dijital imza ile onayla"
        />
        <FeatureCard 
          icon="📸" 
          title="Fotoğraf Yükle" 
          description="Bakım fotoğrafları ekle"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Kurulum tamamlandıktan sonra tam özellikler aktif olacaktır
        </Text>
      </View>
    </View>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  features: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
  },
});
