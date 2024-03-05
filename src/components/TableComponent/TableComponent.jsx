import { Table, Button } from 'antd';
import React, { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from 'react';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data:dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
    };
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }
    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnExport)
            .addDataSource(dataSource, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    };

    return (
        <Loading isLoading={isLoading}>
            <div style={{display: "flex", gap: "6px", margin: "16px", marginLeft: 0}}>
                <Button onClick={exportExcel}>Export Excel</Button>
                {!!rowSelectedKeys.length && (
                    <Button onClick={handleDeleteAll} danger> Xóa tất cả</Button>
                )}
            </div>
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent
