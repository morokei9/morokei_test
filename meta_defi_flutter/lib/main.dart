import 'package:flutter/material.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late WalletConnect connector;
  SessionStatus? _session;
  String? _account;
  Web3Client? _web3client;

  @override
  void initState() {
    super.initState();
    connector = WalletConnect(
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: const PeerMeta(
        name: 'Flutter DeFi App',
        description: 'Example DeFi app',
        url: 'https://example.com',
        icons: ['https://example.com/icon.png'],
      ),
    );
  }

  Future<void> _connect() async {
    if (!connector.connected) {
      try {
        _session = await connector.createSession(onDisplayUri: (uri) async {
          await launchUrl(Uri.parse(uri), mode: LaunchMode.externalApplication);
        });
        final rpcUrl = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
        _web3client = Web3Client(rpcUrl, Client());
        setState(() {
          _account = _session!.accounts.isNotEmpty ? _session!.accounts.first : null;
        });
      } catch (e) {
        debugPrint(e.toString());
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MetaMask DeFi App',
      home: Scaffold(
        appBar: AppBar(title: const Text('MetaMask DeFi App')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(_account != null ? 'Connected: $_account' : 'Not connected'),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _connect,
                child: const Text('Connect MetaMask'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
