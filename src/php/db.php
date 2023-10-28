<?php
class DB {
    public $conn;
    public $open;
    public $error;

    /**
     * initiates the connection and checks for an error
     */
    function __construct() {
        require "credentials.php";
        $this->conn = new mysqli($host, $user, $pass, $db);

        if (!$this->conn) {
            $this->error = $this->conn->error;
        }
    }

    /**
     * closes the connection when the object is garbage collected
     */
    function __destruct() {
        $this->conn->close();
    }

    /**
     * inserts data passed to it into fields passed to it into the table that was passed to it
     * 
     * Note: the only user input that enters this function should be through the $data variable
     * 
     * @param string    $table  the name of the table to insert into
     * @param string    $types  the types of the data to be inserted (e.g. "ssii" for string,string,int,int)
     * @param array     $data   the data to be inserted with the field as the key (e.g. ['email'=>$email])
     */
    function insert(string $table,string $types,array $data) {
    
        $fields = array_keys($data);

        $values = array_values($data);
    
        $query = $this->conn->prepare("INSERT INTO ".$table." (".implode(',',$fields).") VALUES (?".str_repeat(',?',count($fields-1)).")");
        $query->bind_param($types,...$values);
    
        if ($query->execute()) {
            return true;
        }
        return false;
    }

    /**
     * updates data passed to it into fields passed to it into the table that was passed to it
     * 
     * Note: the only user input that enters this function should be through the $data variable
     * 
     * @param string    $table  the name of the table to insert into
     * @param string    $types  the types of the data to be inserted (e.g. "ssii" for string,string,int,int)
     * @param array     $data   the data to be inserted with the field as the key (e.g. ['email'=>$email])
     */
    function update(string $table,string $types,array $data) {
        echo 'implement this';
        die(0);
    }

    /**
     * Selects from the specified tables on the specified fields
     * 
     * Note: the only user input that enters this function should be through the $data variable
     * 
     * @param string    $table  the name of the table to insert into
     * @param array     $select the fields to select e.g. ['id','name']
     * @param string    $types  the types of the data to be inserted (e.g. "ssii" for string,string,int,int)
     * @param array     $where  the data to be inserted with the field as the key (e.g. ['email'=>$email])
     */
    function select($table,$select,$types,$where) {
    
        $fields = array_keys($where);

        $values = array_values($where);
    
        $query = $this->conn->prepare("SELECT ".implode(',',$select)." FROM ".$table." WHERE ".implode('=? OR ',$fields)."=?");
        $query->bind_param($types,...$values);
    
        if ($query->execute()) {
            return $query->get_result();
        }
        return false;
    }

}

$db = new DB();
?>
