import React, {useEffect, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [token, setToken] = useState(null);

  async function login() {
    try {
      const response = await fetch('http://localhost/api/sanctum/token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          device_name: deviceName,
        }),
      });

      const text = await response.text();

      if (response.status === 200) {
        setToken(text);
      } else {
        console.error(text);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (token) {
    return <Home token={token} onLogout={() => setToken(null)} />;
  }

  return (
    <SafeAreaView>
      <View style={styles.form}>
        <Text>Login</Text>

        <Field label="Email" value={email} setValue={setEmail} />
        <Field
          label="Password"
          value={password}
          setValue={setPassword}
          isPassword
        />
        <Field
          label="Device Name"
          value={deviceName}
          setValue={setDeviceName}
        />

        <Button title="Login" onPress={login} />
      </View>
    </SafeAreaView>
  );
}

function Home({token, onLogout}) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const response = await fetch('http://localhost/api/user', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();

      if (response.status === 200) {
        setUser(json);
      } else {
        console.error(json);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function logout() {
    try {
      const response = await fetch('http://localhost/api/sanctum/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (response.status === 200) {
        onLogout();
      } else {
        const error = await response.text();
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SafeAreaView>
      <Text>{token}</Text>

      {user !== null && (
        <View>
          <Text>{user.name}</Text>
        </View>
      )}

      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
}

function Field({label, value, setValue, isPassword = false}) {
  return (
    <View style={styles.field}>
      <Text>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          autoCapitalize="none"
          secureTextEntry={isPassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 10,
  },

  field: {
    marginBottom: 20,
  },

  inputContainer: {
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },

  input: {
    fontSize: 14,
  },
});
