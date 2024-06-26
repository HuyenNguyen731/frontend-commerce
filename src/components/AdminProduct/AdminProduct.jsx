import React, { useRef, useState, useEffect } from "react";
import { Button, Form, Space, Select } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalAddProduct from "../ModalAddProduct/ModalAddProduct";
import { getBase64 } from "../../utils";
import * as ProductService from "../../services/ProductService";
import * as CategoryService from "../../services/CategoryService";
import * as message from "../../components/Message/Message";
import ModalDelete from "../ModalDelete/ModalDelete";

const initial = () => ({
  name: "",
  price: "",
  description: "",
  rating: "",
  image: "",
  type: "",
  countInStock: "",
  newType: "",
  discount: "",
});

const AdminProduct = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const searchInput = useRef(null);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenProduct, setIsModalOpenProduct] = useState(false);
  const [stateProductDetails, setStateProductDetails] = useState(initial());
  const user = useSelector((state) => state?.user);

  const getAllCategory = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory,
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }

    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpenProduct) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(initial());
    }
  }, [form, stateProductDetails, isModalOpenProduct]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price <= 50;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "<= 3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.rating) >= 3;
        }
        return Number(record.rating) <= 3;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (typeId) => {
        const category = categories?.data.find(
          (category) => category._id === typeId
        );
        return category ? category.name : "Unknown";
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={openDrawer}
          />
          <Button danger icon={<DeleteOutlined />} onClick={openModalDelete} />
        </div>
      ),
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails(initial);
    form.resetFields();
  };

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSuccess: () => {
          message.success();
          queryClient.invalidateQueries(["products"]);
        },
        onError: (error) => {
          message.error(error);
        },
      }
    );
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSuccess: () => {
          message.success();
          closeModalDelete();
          queryClient.invalidateQueries(["products"]);
        },
        onError: (error) => {
          message.error(error);
        },
      }
    );
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const handleChangeType = (value, option) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateProductDetails },
      {
        onSuccess: () => {
          message.success();
          handleCloseDrawer();
          queryClient.invalidateQueries(["products"]);
        },
        onError: (error) => {
          message.error(error);
        },
      }
    );
  };

  const openModalAddProduct = () => {
    setIsModalOpenProduct(true);
  };

  const closeModalProduct = () => {
    setIsModalOpenProduct(false);
  };

  const openDrawer = () => {
    setIsOpenDrawer(true);
  };

  const openModalDelete = () => {
    setIsModalOpenDelete(true);
  };

  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  return (
    <div className="pr-10 pl-4">
      <div className="text-[16px] font-semibold">
        <span className="font-normal">Quản lý</span> / Sản phẩm
      </div>
      <Button
        type="primary"
        onClick={openModalAddProduct}
        icon={<PlusOutlined />}
        className="mt-5 mb-[-10px]"
      >
        Thêm sản phẩm
      </Button>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProducts}
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>

      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        width="90%"
        onClose={() => setIsOpenDrawer(false)}
      >
        <Loading isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Chọn danh mục"
                options={categories?.data?.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
                onChange={handleChangeType}
                defaultValue={stateProductDetails?.type}
              />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your count rating!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnchangeDetails}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnchangeDetails}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalAddProduct
        open={isModalOpenProduct}
        onClose={closeModalProduct}
        queryProduct={queryProduct}
      />
      <ModalDelete
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={closeModalDelete}
        onOk={handleDeleteProduct}
        description="Bạn có chắc muốn xóa sản phẩm này không?"
      />
    </div>
  );
};

export default AdminProduct;
