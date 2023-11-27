import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  task: string;
}

const TodoItem = ({ item, onDelete }: { item: Todo; onDelete: (id: string) => void }) => (
  <View style={styles.todoItem}>
    <View style={styles.todoIndicator} />
    <Text style={styles.todoText}>{item.task}</Text>
    <TouchableOpacity onPress={() => onDelete(item.id)}>
      <Text style={styles.todoRemove}>Remove</Text>
    </TouchableOpacity>
  </View>
);

const TodoListScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');

  const addTodo = () => {
    setTodos([...todos, { id: `${todos.length + 1}`, task }]);
    setTask('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const saveData = async (key: string, data: Object) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      const savedTodos = await getData('todos');
      if (savedTodos !== null) {
        setTodos(savedTodos);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    saveData('todos', todos);
  }, [todos]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust as needed
    >
      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={todos}
          style={styles.todoContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TodoItem item={item} onDelete={deleteTodo} />}
        />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter here"
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity style={styles.todoAddContainer} onPress={addTodo}>
          <Text style={styles.todoAdd}>Add</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items horizontally
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    margin: 10,
  },
  todoContainer: {
    flex: 1,
  },
  todoAddContainer: {
    backgroundColor: '#0b63ea',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    fontSize: 22,
    fontWeight: 'bold',
  },
  todoAdd: {
    color: 'white',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  todoIndicator: {
    backgroundColor: '#0b63ea',
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: 15,
  },
  todoText: {
    fontSize: 20,
    flex: 1,
  },
  todoRemove: {
    fontSize: 20,
  },
  input: {
    height: 40,
    padding: 8,
    flex: 1,
    fontSize: 18,
    borderBottomColor: '#5f5f5f82',
    borderBottomWidth: 1,
    marginRight: 10, // Add margin to the right to separate it from the button
  },
});

export default TodoListScreen;
