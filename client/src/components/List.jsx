import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Input, Button, Divider, Spacer, Card, Checkbox } from "@heroui/react";

export const List = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const API_BASE = process.env.REACT_APP_BACKEND_BASE_URL;
  const token = Cookies.get("token"); // ← LoginForm と同じ仕様

  const axiosConfig = {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  // 一覧取得
  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/auth/shopping-list`,
        axiosConfig
      );
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 新規追加
  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      await axios.post(
        `${API_BASE}/auth/shopping-list`,
        { name: newItem },
        axiosConfig
      );
      setNewItem("");
      fetchItems();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // チェック更新
  const toggleCheck = async (id, newValue) => {
    try {
      await axios.patch(
        `${API_BASE}/auth/shopping-list/${id}/check`,
        { is_checked: newValue },
        axiosConfig
      );
      fetchItems();
    } catch (err) {
      console.error("Error updating check:", err);
    }
  };
  

  // 削除

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/auth/shopping-list/${id}`, axiosConfig);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <div>
      <Spacer y={3} />
      <h1 className="text-lg font-bold">買い物リスト</h1>
      <Divider className="my-4" />

      <div className="flex w-full mx-auto md:flex-nowrap gap-4">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          label="商品名"
          fullWidth
          className="mx-4"
        />
        <Button
          onPress={handleAddItem}
          className="my-auto mr-3 text-white"
          color="success"
        >
          追加
        </Button>
      </div>

      <Spacer y={4} />

      {items.map((item) => (
        <div key={item.shopping_list_id} className="m-3">
          <Card>
            <div className="flex justify-between items-center mx-2">
              <Checkbox
                isSelected={!!item.is_checked}
                onValueChange={() =>
                  toggleCheck(item.shopping_list_id, !item.is_checked)
                }
              >
                <span
                  className={item.is_checked ? "line-through opacity-60" : ""}
                >
                  {item.name}
                </span>
              </Checkbox>

              <Button
                onPress={() => handleDeleteItem(item.shopping_list_id)}
                className="m-2"
                color="danger"
                variant="flat"
              >
                削除
              </Button>
            </div>
          </Card>
          <Spacer y={2} />
        </div>
      ))}
    </div>
  );
};
