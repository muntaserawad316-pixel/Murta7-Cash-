import 'package:flutter/material.dart';
import 'screens/app_entry_screen.dart';

void main() {
  runApp(const EWalletApp());
}

class EWalletApp extends StatelessWidget {
  const EWalletApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'محفظتي الإلكترونية',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Cairo',
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
      ),
      // التطبيق دايماً بيبدأ من هنا — الشاشة دي بتقرر لوحدها
      // لو تروح لـ LoginScreen ولا PinUnlockScreen ولا الداشبورد مباشرة
      home: const AppEntryScreen(),
    );
  }
}
