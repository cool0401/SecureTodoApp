import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  task: string;
}

const TodoItem = ({ item, onDelete, onEdit }: { item: Todo; onDelete: (id: string) => void; onEdit: (id: string, task: string) => void }) => {
  return (
    <View style={styles.todoItem}>
      <View style={styles.todoIndicator} />
      <TouchableOpacity style={styles.todoTextContainer} onPress={() => onEdit(item.id, item.task)}>
        <Text style={styles.todoText}>{item.task}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={styles.todoRemove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const TodoListScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const addTodo = () => {
    setTodos([...todos, { id: `${todos.length + 1}`, task }]);
    setTask('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, currentTask: string) => {
    // Set the selected todo item ID for editing
    setSelectedItemId(id);
    // Set the current task in the input field
    setTask(currentTask);
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

  const handleSaveEdit = () => {
    if (selectedItemId) {
      // Update the task of the selected todo item
      setTodos(todos.map(todo => (todo.id === selectedItemId ? { ...todo, task } : todo)));
      // Clear the selected item ID and reset the input field
      setSelectedItemId(null);
      setTask('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust as needed
    >
      <Text style={styles.header}>TODO:</Text>
      <FlatList
        data={todos}
        style={styles.todoContainer}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TodoItem item={item} onDelete={deleteTodo} onEdit={editTodo} />}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter here"
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity style={styles.todoAddContainer} onPress={selectedItemId ? handleSaveEdit : addTodo}>
          <Text style={styles.todoAdd}>{selectedItemId ? 'Save' : 'Add'}</Text>
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
  header: {
    fontSize: 30,
    color:'#0346ac',
    fontWeight: 'bold',
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 20
  },
  todoContainer: {
    flex: 1,
  },
  todoAddContainer: {
    backgroundColor: '#0346ac',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    fontSize: 22,
    fontWeight: 'bold',
  },
  todoTextContainer: {
    flex: 1,
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
    borderRadius: 30,
    backgroundColor: 'white',
  },
  todoIndicator: {
    backgroundColor: '#0346ac',
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
