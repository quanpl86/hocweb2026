# Lý thuyết cốt lõi về Flexbox

### 1. Kích hoạt Flex Container
Để một thẻ cha trở thành Flex Container, ta chỉ cần khai báo:
```css
.container {
  display: flex;
}
```
Lúc này, tất cả các thẻ con trực tiếp bên trong sẽ tự động trở thành **Flex Items** và xếp nằm ngang theo mặc định.

### 2. Hai trục trong Flexbox
- **Trục chính (Main Axis)**: Mặc định nằm ngang từ trái qua phải (khi `flex-direction: row`).
- **Trục phụ (Cross Axis)**: Vuông góc với trục chính, mặc định từ trên xuống dưới.

### 3. Căn chỉnh trên trục chính với `justify-content`
- `flex-start`: Dồn về đầu trục (mặc định).
- `center`: Căn chính giữa trục.
- `flex-end`: Dồn về cuối trục.
- `space-between`: Phân bổ đều, phần tử đầu sát lề trái, phần tử cuối sát lề phải.
- `space-around` / `space-evenly`: Khoảng cách đều nhau quanh các phần tử.
