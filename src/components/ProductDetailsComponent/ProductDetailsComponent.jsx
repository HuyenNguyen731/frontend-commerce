import React, { useEffect, useState } from "react";
import { Col, Image, Rate, Row } from "antd";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import imageProductSmall from "../../assets/images/imageProductSmall.jpg";
import details from "../../assets/images/details.svg";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import Loading from "../LoadingComponent/Loading";
import { convertPrice, initFacebookSDK } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slides/orderSlide";
import * as message from "../../components/Message/Message";
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";

const ProductDetailsComponent = ({ idProduct }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [numProduct, setNumProduct] = useState(1);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { isLoading, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    config: { enabled: !!idProduct },
  });

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
            user: user?.id,
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const handleBuyNow = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
            user: user?.id,
          })
        );
        navigate("/order");
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetails?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
      (!orderRedux && productDetails?.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct]);

  useEffect(() => {
    if (order.isSucessOrder) {
      message.success("Đã thêm vào giỏ hàng");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSucessOrder]);

  useEffect(() => {
    initFacebookSDK();
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <Row
        style={{
          padding: "16px",
          background: "#fff",
          borderRadius: "4px",
          height: "100%",
        }}
      >
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <div
            style={{
              display: "grid",
              placeContent: "center",
              backgroundColor: "#efefef",
              padding: "40px 0",
            }}
          >
            <Image
              src={productDetails?.image}
              alt="image product"
              preview={false}
            />
          </div>
          <Row style={{ paddingTop: "10px" }}>
            <WrapperStyleColImage span={4} sty>
              <WrapperStyleImageSmall
                src={productDetails?.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            {/*<WrapperStyleColImage span={4}>*/}
            {/*    <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />*/}
            {/*</WrapperStyleColImage>*/}
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div className="my-5">
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />
            <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails?.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct className="py-5">
            <span>Giao đến </span>
            <span className="address">{user?.address}</span>
          </WrapperAddressProduct>
          <LikeButtonComponent
            dataHref={
              process.env.REACT_APP_IS_LOCAL
                ? "https://developers.facebook.com/docs/plugins/"
                : window.location.href
            }
          />
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>Số lượng</div>
            <WrapperQualityProduct>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleChangeCount("decrease", numProduct === 1)}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "16px" }} />
              </button>
              <WrapperInputNumber
                onChange={onChange}
                defaultValue={1}
                max={productDetails?.countInStock}
                min={1}
                value={numProduct}
                size="small"
              />
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleChangeCount(
                    "increase",
                    numProduct === productDetails?.countInStock
                  )
                }
              >
                <PlusOutlined style={{ color: "#000", fontSize: "16px" }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ButtonComponent
              size={40}
              styleButton={{
                background: "#fff",
                height: "48px",
                width: "220px",
                border: "1px solid #f63f2e",
                borderRadius: "4px",
              }}
              textbutton={"Thêm vào giỏ hàng"}
              styleTextButton={{ color: "#f63f2e", fontSize: "15px" }}
              onClick={handleAddOrderProduct}
            ></ButtonComponent>
            <div>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "#f63f2e",
                  height: "48px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                }}
                onClick={handleBuyNow}
                textbutton={"Mua ngay"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
              {errorLimitOrder && (
                <div style={{ color: "red" }}>Sản phẩm hết hàng</div>
              )}
            </div>
          </div>
        </Col>
        {/*<CommentComponent*/}
        {/*    dataHref={process.env.REACT_APP_IS_LOCAL*/}
        {/*        ? "https://developers.facebook.com/docs/plugins/comments#configurator"*/}
        {/*        : window.location.href*/}
        {/*    }*/}
        {/*style={{ padding: '16px', background: '#fff', borderRadius: '4px', marginTop: 16}}>*/}
        {/*    width="1150"*/}
        {/*/>*/}
      </Row>
      <img src={details} alt="image small" preview={false} />

      <div className="my-5 rounded-md">
        <div className="p-4 bg-white">
          <div className="text-[16px] font-medium mt-3">CHI TIẾT SẢN PHẨM</div>
          <div className="text-md">
            {productDetails?.description}
            Xuất xứ: Ba Lan
            <br />
            Dung tích: dạng hũ 50ml
            <br />
            Thương hiệu: Bielenda
            <br />
            HSD: 3 năm kể từ ngày sản xuất Công ty chịu trách nhiệm: Công ty
            TNHH XNK RUTOP Việt Nam
            <br />
            Địa chỉ: 64 Xuân Hà – Xuân Mai – Chương Mỹ – Hà Nội ✨Kem dưỡng
            <br />
            <br />
            Bielenda Bakuchiol Bio Retinol Effect Anti-wrinkle Moisturizing Face
            Cream 40+ giúp dưỡng ẩm hiệu quả, mờ nếp nhăn và trẻ hoá da, làm
            sáng mịn và đều màu da. Sản phẩm chứa 97% nguồn gốc từ các chiết
            xuất thực vật lành tính. <br />
            – BAKUCHIOL <br />
            – một thành phần thảo mộc có tác dụng tương tự như Retinol nhưng hạn
            chế nguy cơ kích ứng, có thể dùng được cho bà bầu, cho con bú và sử
            dụng được cả ban ngày. Hoàn toàn kết hợp được với AHA, BHA mà không
            lo kích ứng. Kết hợp hoàn hảo với Retinol để tăng cường kích thích
            sản xuất Retinol tự thân. → Giúp hỗ trợ giảm mụn, chống lão hoá, cải
            thiện sắc tố da, mờ thâm, nám, tàn nhang, hiệu quả cao trong việc
            kích thích tái tạo và phục hồi tế bào da, làm mịn và khoẻ da. <br />
            – GINKGO BILOBA: tăng tuần hoàn máu dưới da cho da hồng hào khỏe
            mạnh, giúp cải thiện độ săn chắc và đàn hồi của da, nâng tông da,
            kích thích sản sinh Hyaluronic Acid – cung cấp độ ẩm và làm da căng
            bóng. <br />
            – AMERICAN BLUEBERRY <br />
            – chất chống oxy hóa mạnh với hàm lượng vitamin C cao, làm mịn và
            cải thiện tông da, làm sáng da hiệu quả. <br />
            –Squalene chiếm tỉ trọng cao + nước thông thường trong công thức đã
            được thay thế phần lớn bằng nước hoa hồng làm dịu → dưỡng ẩm và củng
            cố hàng rào bảo vệ da, trẻ hoá da hiệu quả. <br />
            – Complex dầu hướng dương + dầu thực vật từ rau củ + vitamin E + dầu
            đậu nành → dưỡng ẩm hoàn hảo cho làn da thô ráp. <br />– Ceramide &
            Allantoin → dưỡng ẩm, phục hồi và củng cố hàng rào bảo vệ da
          </div>
        </div>
      </div>

      <div className="my-5 rounded-md">
        <div className="p-4 bg-white">
          <div className="text-[16px] font-medium mt-3">ĐÁNH GIÁ</div>
          <div> Chưa có đánh giá nào</div>
        </div>
      </div>
    </Loading>
  );
};

export default ProductDetailsComponent;
