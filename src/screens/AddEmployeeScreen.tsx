import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { ArrowLeft, ChevronDown, Plus } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { ScreenContainer } from '../components/ScreenContainer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { MainDrawerParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import { usersApi } from '../api/users';
import { useAuth } from '../api/authContext';
import { Alert, ActivityIndicator, Image, Modal, FlatList } from 'react-native';
import { departmentsApi } from '../api/departments';
import { designationsApi } from '../api/designations';
import { uploadApi } from '../api/upload';
import { rolesApi } from '../api/roles';
import { Department, Designation, Role } from '../api/types';

const employeeSchema = z.object({
  type: z.enum(['Employee', 'Labour', 'Contractor']),
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  designationId: z.number().optional(),
  department: z.string().optional(),
  departmentId: z.number().optional(),
  role: z.string().optional(),
  roleId: z.number().optional(),
  contratar: z.string().optional(),
  aadhaarNo: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;
type NavigationProp = DrawerNavigationProp<MainDrawerParamList, 'AddEmployee'>;

export const AddEmployeeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { token } = useAuth();
  const [employeeType, setEmployeeType] = useState<'Employee' | 'Labour' | 'Contractor'>('Employee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isDeptModalVisible, setIsDeptModalVisible] = useState(false);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(false);
  const [isDesigModalVisible, setIsDesigModalVisible] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [contractors, setContractors] = useState<UserResponse[]>([]);
  const [isLoadingContractors, setIsLoadingContractors] = useState(false);
  const [isContractorModalVisible, setIsContractorModalVisible] = useState(false);

  React.useEffect(() => {
    fetchDepartments();
    fetchDesignations();
    fetchRoles();
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    setIsLoadingContractors(true);
    try {
      const data = await usersApi.getContractors(token || undefined);
      setContractors(data);
    } catch (error: any) {
      console.error('Fetch Contractors Error:', error);
    } finally {
      setIsLoadingContractors(false);
    }
  };

  const fetchDepartments = async () => {
    setIsLoadingDepartments(true);
    try {
      const data = await departmentsApi.getDepartments(token || undefined);
      setDepartments(data);
    } catch (error: any) {
      console.error('Fetch Departments Error:', error);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const fetchDesignations = async () => {
    setIsLoadingDesignations(true);
    try {
      const data = await designationsApi.getDesignations(token || undefined);
      setDesignations(data);
    } catch (error: any) {
      console.error('Fetch Designations Error:', error);
    } finally {
      setIsLoadingDesignations(false);
    }
  };

  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const data = await rolesApi.getRoles(token || undefined);
      setRoles(data);
    } catch (error: any) {
      console.error('Fetch Roles Error:', error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      type: 'Employee',
      name: '',
      email: '',
      phone: '',
      password: 'password123',
      roleId: undefined,
      contratar: '',
      aadhaarNo: '',
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // Keep base64 for now as fallback
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPhotoUri(asset.uri);
      setPhotoBase64(asset.base64 || null);

      setIsUploadingPhoto(true);
      const formData = new FormData();
      const filename = asset.uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('photo', {
        uri: asset.uri,
        name: filename,
        type: type,
      } as any);

      try {
        const response = await uploadApi.uploadPhoto(formData, token || undefined);
        setPhotoUrl(response.url);
      } catch (error: any) {
        console.error('Photo Upload Error:', error);
        Alert.alert('Error', 'Failed to upload photo');
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      const payload: UserPayload = {
        name: data.name,
        phoneNo: data.phone,
        address: data.contratar || '',
        password: data.password,
        photo: photoUrl || photoBase64 || '',
        status: 1,
        type: data.type.toLowerCase(),
        aadharNo: data.aadhaarNo,
      };

      if (data.email) {
        payload.email = data.email;
      }

      if (data.type === 'Employee') {
        payload.roleId = data.roleId;
        payload.departmentId = data.departmentId;
        payload.designationId = data.designationId;
      }

      console.log('--- ADD EMPLOYEE REQUEST ---');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await usersApi.addUser(payload, token || undefined);

      console.log('--- ADD EMPLOYEE RESPONSE ---');
      console.log('Response:', JSON.stringify(response, null, 2));

      if (response.id) {
        navigation.navigate('Success', {
          message: `Employee added successfully\nEmployee ID: ${response.employeeId}`
        });
      } else {
        // This part should technically be handled by the catch block if apiClient rejects correctly
        Alert.alert('Error', 'Failed to add employee');
      }
    } catch (error: any) {
      console.error('--- ADD EMPLOYEE ERROR ---');
      console.error('Error Details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error?.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Employee</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Type</Text>
            <View style={styles.radioRow}>
              {['Employee', 'Labour', 'Contractor'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioButton}
                  onPress={() => {
                    setEmployeeType(type as any);
                    setValue('type', type as any);
                  }}
                >
                  <View style={[styles.radioCircle, employeeType === type && styles.radioActive]}>
                    {employeeType === type && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Name"
                placeholder="Enter Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          {employeeType === 'Employee' ? (
            <>
              <Controller
                control={control}
                name="designation"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectContainer}>
                    <Text style={styles.inputLabel}>Designation</Text>
                    <TouchableOpacity
                      style={styles.selectBox}
                      onPress={() => setIsDesigModalVisible(true)}
                    >
                      <Text style={[styles.selectPlaceholder, value && { color: '#000' }]}>
                        {value || 'Please Select the Designation'}
                      </Text>
                      <ChevronDown size={20} color="#94a3b8" />
                    </TouchableOpacity>
                    {errors.designation && (
                      <Text style={styles.errorText}>{errors.designation.message}</Text>
                    )}

                    <Modal
                      visible={isDesigModalVisible}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setIsDesigModalVisible(false)}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Designation</Text>
                            <TouchableOpacity onPress={() => setIsDesigModalVisible(false)}>
                              <Plus size={24} color="#000" style={{ transform: [{ rotate: '45deg' }] }} />
                            </TouchableOpacity>
                          </View>

                          {isLoadingDesignations ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 20 }} />
                          ) : (
                            <FlatList
                              data={designations}
                              keyExtractor={(item) => item.id.toString()}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  style={styles.departmentItem}
                                  onPress={() => {
                                    onChange(item.name);
                                    setValue('designationId', item.id);
                                    setIsDesigModalVisible(false);
                                  }}
                                >
                                  <Text style={styles.departmentItemText}>{item.name}</Text>
                                </TouchableOpacity>
                              )}
                              ListEmptyComponent={
                                <Text style={styles.emptyText}>No designations found</Text>
                              }
                            />
                          )}
                        </View>
                      </View>
                    </Modal>
                  </View>
                )}
              />

              <Controller
                control={control}
                name="department"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectContainer}>
                    <Text style={styles.inputLabel}>Department</Text>
                    <TouchableOpacity
                      style={styles.selectBox}
                      onPress={() => setIsDeptModalVisible(true)}
                    >
                      <Text style={[styles.selectPlaceholder, value && { color: '#000' }]}>
                        {value || 'Please Select the Department'}
                      </Text>
                      <ChevronDown size={20} color="#94a3b8" />
                    </TouchableOpacity>
                    {errors.department && (
                      <Text style={styles.errorText}>{errors.department.message}</Text>
                    )}

                    <Modal
                      visible={isDeptModalVisible}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setIsDeptModalVisible(false)}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Department</Text>
                            <TouchableOpacity onPress={() => setIsDeptModalVisible(false)}>
                              <Plus size={24} color="#000" style={{ transform: [{ rotate: '45deg' }] }} />
                            </TouchableOpacity>
                          </View>

                          {isLoadingDepartments ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 20 }} />
                          ) : (
                            <FlatList
                              data={departments}
                              keyExtractor={(item) => item.id.toString()}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  style={styles.departmentItem}
                                  onPress={() => {
                                    onChange(item.name);
                                    setValue('departmentId', item.id);
                                    setIsDeptModalVisible(false);
                                  }}
                                >
                                  <Text style={styles.departmentItemText}>{item.name}</Text>
                                </TouchableOpacity>
                              )}
                              ListEmptyComponent={
                                <Text style={styles.emptyText}>No departments found</Text>
                              }
                            />
                          )}
                        </View>
                      </View>
                    </Modal>
                  </View>
                )}
              />

              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectContainer}>
                    <Text style={styles.inputLabel}>Role</Text>
                    <TouchableOpacity
                      style={styles.selectBox}
                      onPress={() => setIsRoleModalVisible(true)}
                    >
                      <Text style={[styles.selectPlaceholder, value && { color: '#000' }]}>
                        {value || 'Please Select the Role'}
                      </Text>
                      <ChevronDown size={20} color="#94a3b8" />
                    </TouchableOpacity>
                    {errors.roleId && (
                      <Text style={styles.errorText}>{errors.roleId.message}</Text>
                    )}

                    <Modal
                      visible={isRoleModalVisible}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setIsRoleModalVisible(false)}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Role</Text>
                            <TouchableOpacity onPress={() => setIsRoleModalVisible(false)}>
                              <Plus size={24} color="#000" style={{ transform: [{ rotate: '45deg' }] }} />
                            </TouchableOpacity>
                          </View>

                          {isLoadingRoles ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 20 }} />
                          ) : (
                            <FlatList
                              data={roles}
                              keyExtractor={(item) => item.id.toString()}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  style={styles.departmentItem}
                                  onPress={() => {
                                    onChange(item.name);
                                    setValue('roleId', item.id);
                                    setIsRoleModalVisible(false);
                                  }}
                                >
                                  <Text style={styles.departmentItemText}>{item.name}</Text>
                                </TouchableOpacity>
                              )}
                              ListEmptyComponent={
                                <Text style={styles.emptyText}>No roles found</Text>
                              }
                            />
                          )}
                        </View>
                      </View>
                    </Modal>
                  </View>
                )}
              />
            </>
          ) : (
            <>
              {employeeType === 'Labour' && (
                <Controller
                  control={control}
                  name="contratar"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.selectContainer}>
                      <Text style={styles.inputLabel}>Contratar</Text>
                      <TouchableOpacity 
                        style={styles.selectBox} 
                        onPress={() => setIsContractorModalVisible(true)}
                      >
                        <Text style={[styles.selectPlaceholder, value && { color: '#000' }]}>
                          {value || 'Please Select the Contractor'}
                        </Text>
                        <ChevronDown size={20} color="#94a3b8" />
                      </TouchableOpacity>
                      
                      <Modal
                        visible={isContractorModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsContractorModalVisible(false)}
                      >
                        <View style={styles.modalOverlay}>
                          <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                              <Text style={styles.modalTitle}>Select Contractor</Text>
                              <TouchableOpacity onPress={() => setIsContractorModalVisible(false)}>
                                <Plus size={24} color="#000" style={{ transform: [{ rotate: '45deg' }] }} />
                              </TouchableOpacity>
                            </View>
                            
                            {isLoadingContractors ? (
                              <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 20 }} />
                            ) : (
                              <FlatList
                                data={contractors}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                  <TouchableOpacity
                                    style={styles.departmentItem}
                                    onPress={() => {
                                      onChange(item.name);
                                      setIsContractorModalVisible(false);
                                    }}
                                  >
                                    <View>
                                      <Text style={styles.departmentItemText}>{item.name}</Text>
                                      <Text style={{ fontSize: 12, color: '#64748b' }}>{item.employeeId}</Text>
                                    </View>
                                  </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                  <Text style={styles.emptyText}>No contractors found</Text>
                                }
                              />
                            )}
                          </View>
                        </View>
                      </Modal>
                    </View>
                  )}
                />
              )}
              <Controller
                control={control}
                name="aadhaarNo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Aadhaar No"
                    placeholder="Enter the Aadhaar no"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email ID"
                placeholder="Enter Email ID"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                placeholder="Enter Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Upload Photo</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={pickImage}
              disabled={isUploadingPhoto}
            >
              {isUploadingPhoto ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={styles.previewImage}
                />
              ) : (
                <>
                  <Plus size={32} color="#94a3b8" />
                  <Text style={styles.uploadText}>Upload Photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <Button
            title={isSubmitting ? "Submitting..." : "Submit"}
            onPress={handleSubmit(onSubmit)}
            style={styles.submitBtn}
            disabled={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
    marginLeft: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 30,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#274494',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#274494',
  },
  radioLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  selectContainer: {
    marginBottom: 20,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#64748b',
  },
  uploadSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    color: '#64748b',
  },
  submitBtn: {
    marginTop: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '40%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  departmentItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  departmentItemText: {
    fontSize: 16,
    color: '#1e293b',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 20,
  },
});
